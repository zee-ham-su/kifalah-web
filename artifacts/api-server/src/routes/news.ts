import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { db, newsArticlesTable } from "@workspace/db";
import {
  ListNewsQueryParams,
  ListNewsResponse,
  CreateNewsArticleBody,
  CreateNewsArticleResponse,
  GetNewsArticleParams,
  GetNewsArticleResponse,
  UpdateNewsArticleParams,
  UpdateNewsArticleBody,
  UpdateNewsArticleResponse,
  DeleteNewsArticleParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";

const router: IRouter = Router();

router.get("/news", async (req, res): Promise<void> => {
  const query = ListNewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let articles = await db
    .select()
    .from(newsArticlesTable)
    .orderBy(newsArticlesTable.createdAt);

  // Filter published for public access (no auth = only published)
  const auth = getAuth(req);
  if (!auth?.userId) {
    articles = articles.filter((a) => a.published);
  }

  if (query.data.category) {
    articles = articles.filter((a) => a.category === query.data.category);
  }

  if (query.data.featured !== undefined) {
    articles = articles.filter((a) => a.featured === query.data.featured);
  }

  const offset = query.data.offset ?? 0;
  const limit = query.data.limit ?? 100;
  articles = articles.slice(offset, offset + limit);

  res.json(ListNewsResponse.parse(wire(articles)));
});

router.post("/news", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const insertData = {
    ...parsed.data,
    publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
  };
  const [article] = await db.insert(newsArticlesTable).values(insertData).returning();
  res.status(201).json(CreateNewsArticleResponse.parse(wire(article)));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [article] = await db
    .select()
    .from(newsArticlesTable)
    .where(eq(newsArticlesTable.id, params.data.id));

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(GetNewsArticleResponse.parse(wire(article)));
});

router.patch("/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData = {
    ...parsed.data,
    publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : undefined,
    updatedAt: new Date(),
  };
  const [article] = await db
    .update(newsArticlesTable)
    .set(updateData)
    .where(eq(newsArticlesTable.id, params.data.id))
    .returning();

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.json(UpdateNewsArticleResponse.parse(wire(article)));
});

router.delete("/news/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [article] = await db
    .delete(newsArticlesTable)
    .where(eq(newsArticlesTable.id, params.data.id))
    .returning();

  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
