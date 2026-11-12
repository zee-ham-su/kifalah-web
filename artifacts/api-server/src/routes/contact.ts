import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  SubmitContactBody,
  SubmitContactResponse,
  ListContactMessagesResponse,
  MarkContactReadParams,
  MarkContactReadResponse,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";
import { wire } from "../lib/wire";
import { formLimiter } from "../middlewares/formLimiter";
import { notifyStaff } from "../lib/notify";

const router: IRouter = Router();

router.post("/contact", formLimiter, async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [message] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  notifyStaff("contact message", { name: message.name, email: message.email, phone: message.phone, subject: message.subject, message: message.message });
  res.status(201).json(SubmitContactResponse.parse(wire(message)));
});

router.get("/admin/contact", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);

  res.json(ListContactMessagesResponse.parse(wire(messages)));
});

router.patch("/admin/contact/:id/read", requireAdmin, async (req, res): Promise<void> => {
  const params = MarkContactReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [message] = await db
    .update(contactMessagesTable)
    .set({ read: true })
    .where(eq(contactMessagesTable.id, params.data.id))
    .returning();

  if (!message) {
    res.status(404).json({ error: "Message not found" });
    return;
  }

  res.json(MarkContactReadResponse.parse(wire(message)));
});

export default router;
