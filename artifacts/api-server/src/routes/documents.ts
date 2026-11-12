import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, documentsTable } from "@workspace/db";
import {
  ListDocumentsQueryParams,
  ListDocumentsResponse,
  CreateDocumentBody,
  CreateDocumentResponse,
  DeleteDocumentParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";

const router: IRouter = Router();

router.get("/documents", async (req, res): Promise<void> => {
  const query = ListDocumentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let docs = await db
    .select()
    .from(documentsTable)
    .orderBy(documentsTable.createdAt);

  // Only published for public
  const auth = getAuth(req);
  if (!auth?.userId) {
    docs = docs.filter((d) => d.published);
  }

  if (query.data.category) {
    docs = docs.filter((d) => d.category === query.data.category);
  }

  res.json(ListDocumentsResponse.parse(wire(docs)));
});

router.post("/documents", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [doc] = await db.insert(documentsTable).values(parsed.data).returning();
  res.status(201).json(CreateDocumentResponse.parse(wire(doc)));
});

router.delete("/documents/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteDocumentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [doc] = await db
    .delete(documentsTable)
    .where(eq(documentsTable.id, params.data.id))
    .returning();

  if (!doc) {
    res.status(404).json({ error: "Document not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
