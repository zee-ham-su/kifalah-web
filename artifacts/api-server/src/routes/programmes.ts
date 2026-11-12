import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, programmesTable } from "@workspace/db";
import {
  ListProgrammesQueryParams,
  ListProgrammesResponse,
  CreateProgrammeBody,
  CreateProgrammeResponse,
  GetProgrammeParams,
  GetProgrammeResponse,
  UpdateProgrammeParams,
  UpdateProgrammeBody,
  UpdateProgrammeResponse,
  DeleteProgrammeParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";

const router: IRouter = Router();

router.get("/programmes", async (req, res): Promise<void> => {
  const query = ListProgrammesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let programmes = await db
    .select()
    .from(programmesTable)
    .orderBy(programmesTable.sortOrder);

  if (query.data.featured !== undefined) {
    programmes = programmes.filter((p) => p.featured === query.data.featured);
  }

  res.json(ListProgrammesResponse.parse(wire(programmes)));
});

router.post("/programmes", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateProgrammeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [programme] = await db.insert(programmesTable).values(parsed.data).returning();
  res.status(201).json(CreateProgrammeResponse.parse(wire(programme)));
});

router.get("/programmes/:id", async (req, res): Promise<void> => {
  const params = GetProgrammeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [programme] = await db
    .select()
    .from(programmesTable)
    .where(eq(programmesTable.id, params.data.id));

  if (!programme) {
    res.status(404).json({ error: "Programme not found" });
    return;
  }

  res.json(GetProgrammeResponse.parse(wire(programme)));
});

router.patch("/programmes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateProgrammeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProgrammeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [programme] = await db
    .update(programmesTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(programmesTable.id, params.data.id))
    .returning();

  if (!programme) {
    res.status(404).json({ error: "Programme not found" });
    return;
  }

  res.json(UpdateProgrammeResponse.parse(wire(programme)));
});

router.delete("/programmes/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteProgrammeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [programme] = await db
    .delete(programmesTable)
    .where(eq(programmesTable.id, params.data.id))
    .returning();

  if (!programme) {
    res.status(404).json({ error: "Programme not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
