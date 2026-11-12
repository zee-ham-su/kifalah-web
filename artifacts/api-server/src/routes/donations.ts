import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, donationsTable } from "@workspace/db";
import {
  CreateDonationRecordBody,
  CreateDonationRecordResponse,
  ListDonationsResponse,
  UpdateDonationStatusParams,
  UpdateDonationStatusBody,
  UpdateDonationStatusResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";
import { formLimiter } from "../middlewares/formLimiter";
import { notifyStaff } from "../lib/notify";
import { toCsv } from "../lib/csv";

// A "donation" here is a PLEDGE: the visitor's intent to give. No money moves through this site.
const router: IRouter = Router();

router.post("/donations", formLimiter, async (req, res): Promise<void> => {
  const parsed = CreateDonationRecordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { amount, inKindSupport } = parsed.data;
  const hasAmount = typeof amount === "number" && amount > 0 && amount <= 1_000_000_000;
  const hasInKind = Boolean(inKindSupport && inKindSupport.trim());
  if (!hasAmount && !hasInKind) {
    res.status(400).json({ error: "Please give an amount or describe the support you would like to offer." });
    return;
  }

  // Status is always set by the server, never taken from the visitor.
  const [pledge] = await db
    .insert(donationsTable)
    .values({ ...parsed.data, amount: hasAmount ? amount : null, status: "pledged" })
    .returning();

  notifyStaff("pledge", {
    name: pledge.donorName,
    email: pledge.email,
    phone: pledge.phone,
    amount: pledge.amount ? `${pledge.currency} ${pledge.amount}` : null,
    "in-kind support": pledge.inKindSupport,
    programme: pledge.programme,
    message: pledge.message,
  });
  res.status(201).json(CreateDonationRecordResponse.parse(wire(pledge)));
});

router.get("/admin/donations", requireAdmin, async (_req, res): Promise<void> => {
  const pledges = await db.select().from(donationsTable).orderBy(donationsTable.createdAt);
  res.json(ListDonationsResponse.parse(wire(pledges)));
});

router.get("/admin/donations/export.csv", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(donationsTable).orderBy(donationsTable.createdAt);
  const csv = toCsv(
    ["id", "date", "name", "email", "phone", "currency", "amount", "in_kind_support", "programme", "message", "status"],
    rows.map((r) => [r.id, r.createdAt, r.donorName, r.email, r.phone, r.currency, r.amount, r.inKindSupport, r.programme, r.message, r.status]),
  );
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="pledges.csv"');
  res.send(csv);
});

router.patch("/admin/donations/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateDonationStatusParams.safeParse(req.params);
  const body = UpdateDonationStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [pledge] = await db
    .update(donationsTable)
    .set({ status: body.data.status })
    .where(eq(donationsTable.id, params.data.id))
    .returning();
  if (!pledge) {
    res.status(404).json({ error: "Pledge not found" });
    return;
  }
  res.json(UpdateDonationStatusResponse.parse(wire(pledge)));
});

export default router;
