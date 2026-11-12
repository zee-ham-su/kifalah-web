import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, impactStatsTable } from "@workspace/db";
import {
  ListImpactStatsResponse,
  CreateImpactStatBody,
  CreateImpactStatResponse,
  UpdateImpactStatParams,
  UpdateImpactStatBody,
  UpdateImpactStatResponse,
  DeleteImpactStatParams,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";

const router: IRouter = Router();

router.get("/impact-stats", async (_req, res): Promise<void> => {
  const stats = await db
    .select()
    .from(impactStatsTable)
    .orderBy(impactStatsTable.sortOrder);

  res.json(ListImpactStatsResponse.parse(wire(stats)));
});

router.post("/impact-stats", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateImpactStatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [stat] = await db.insert(impactStatsTable).values(parsed.data).returning();
  res.status(201).json(CreateImpactStatResponse.parse(wire(stat)));
});

router.patch("/impact-stats/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateImpactStatParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateImpactStatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [stat] = await db
    .update(impactStatsTable)
    .set(parsed.data)
    .where(eq(impactStatsTable.id, params.data.id))
    .returning();

  if (!stat) {
    res.status(404).json({ error: "Impact stat not found" });
    return;
  }

  res.json(UpdateImpactStatResponse.parse(wire(stat)));
});

router.delete("/impact-stats/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteImpactStatParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [stat] = await db
    .delete(impactStatsTable)
    .where(eq(impactStatsTable.id, params.data.id))
    .returning();

  if (!stat) {
    res.status(404).json({ error: "Impact stat not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
