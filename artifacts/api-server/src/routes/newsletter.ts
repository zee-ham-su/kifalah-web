import { Router, type IRouter } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";
import {
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
  ListNewsletterSubscribersResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";
import { formLimiter } from "../middlewares/formLimiter";
import { toCsv } from "../lib/csv";

const router: IRouter = Router();

router.post("/newsletter", formLimiter, async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [subscriber] = await db.insert(newsletterSubscribersTable).values(parsed.data).returning();
    res.status(201).json(SubscribeNewsletterResponse.parse(wire(subscriber)));
  } catch (err: unknown) {
    // Drizzle wraps the driver error ("Failed query: ..."); the Postgres code lives on .cause.
    // 23505 = unique_violation.
    const code = (err as { cause?: { code?: string }; code?: string })?.cause?.code ?? (err as { code?: string })?.code;
    if (code === "23505") {
      res.status(409).json({ error: "Email already subscribed" });
      return;
    }
    throw err;
  }
});

router.get("/admin/newsletter", requireAdmin, async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(newsletterSubscribersTable.createdAt);

  res.json(ListNewsletterSubscribersResponse.parse(wire(subscribers)));
});

router.get("/admin/newsletter/export.csv", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(newsletterSubscribersTable).orderBy(newsletterSubscribersTable.createdAt);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="subscribers.csv"');
  res.send(toCsv(["id", "date", "name", "email"], rows.map((r) => [r.id, r.createdAt, r.fullName, r.email])));
});

export default router;
