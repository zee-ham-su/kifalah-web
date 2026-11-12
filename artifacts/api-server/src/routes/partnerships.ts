import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, partnershipEnquiriesTable } from "@workspace/db";
import {
  SubmitPartnershipEnquiryBody,
  SubmitPartnershipEnquiryResponse,
  ListPartnershipEnquiriesResponse,
  UpdatePartnershipStatusParams,
  UpdatePartnershipStatusBody,
  UpdatePartnershipStatusResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";
import { formLimiter } from "../middlewares/formLimiter";
import { notifyStaff } from "../lib/notify";

const router: IRouter = Router();

router.post("/partnership", formLimiter, async (req, res): Promise<void> => {
  const parsed = SubmitPartnershipEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [enquiry] = await db.insert(partnershipEnquiriesTable).values(parsed.data).returning();
  notifyStaff("partnership enquiry", { organisation: enquiry.organisationName, contact: enquiry.contactName, email: enquiry.email, phone: enquiry.phone, type: enquiry.organisationType, website: enquiry.website, message: enquiry.message });
  res.status(201).json(SubmitPartnershipEnquiryResponse.parse(wire(enquiry)));
});

router.get("/admin/partnerships", requireAdmin, async (_req, res): Promise<void> => {
  const enquiries = await db
    .select()
    .from(partnershipEnquiriesTable)
    .orderBy(partnershipEnquiriesTable.createdAt);

  res.json(ListPartnershipEnquiriesResponse.parse(wire(enquiries)));
});

router.patch("/admin/partnerships/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdatePartnershipStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePartnershipStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [enquiry] = await db
    .update(partnershipEnquiriesTable)
    .set({ status: parsed.data.status })
    .where(eq(partnershipEnquiriesTable.id, params.data.id))
    .returning();

  if (!enquiry) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }

  res.json(UpdatePartnershipStatusResponse.parse(wire(enquiry)));
});

export default router;
