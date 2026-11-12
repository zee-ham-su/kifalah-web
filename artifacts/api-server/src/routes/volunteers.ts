import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, volunteerApplicationsTable } from "@workspace/db";
import {
  SubmitVolunteerApplicationBody,
  SubmitVolunteerApplicationResponse,
  ListVolunteerApplicationsResponse,
  UpdateVolunteerStatusParams,
  UpdateVolunteerStatusBody,
  UpdateVolunteerStatusResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";
import { formLimiter } from "../middlewares/formLimiter";
import { notifyStaff } from "../lib/notify";

const router: IRouter = Router();

router.post("/volunteer", formLimiter, async (req, res): Promise<void> => {
  const parsed = SubmitVolunteerApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [application] = await db.insert(volunteerApplicationsTable).values(parsed.data).returning();
  notifyStaff("volunteer sign-up", { name: application.fullName, email: application.email, phone: application.phone, location: application.location, interest: application.areaOfInterest, skills: application.skills, availability: application.availability, motivation: application.motivation });
  res.status(201).json(SubmitVolunteerApplicationResponse.parse(wire(application)));
});

router.get("/admin/volunteers", requireAdmin, async (_req, res): Promise<void> => {
  const applications = await db
    .select()
    .from(volunteerApplicationsTable)
    .orderBy(volunteerApplicationsTable.createdAt);

  res.json(ListVolunteerApplicationsResponse.parse(wire(applications)));
});

router.patch("/admin/volunteers/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateVolunteerStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateVolunteerStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [application] = await db
    .update(volunteerApplicationsTable)
    .set({ status: parsed.data.status })
    .where(eq(volunteerApplicationsTable.id, params.data.id))
    .returning();

  if (!application) {
    res.status(404).json({ error: "Application not found" });
    return;
  }

  res.json(UpdateVolunteerStatusResponse.parse(wire(application)));
});

export default router;
