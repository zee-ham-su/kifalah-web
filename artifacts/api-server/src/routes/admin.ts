import { Router, type IRouter } from "express";
import { db, contactMessagesTable, volunteerApplicationsTable, partnershipEnquiriesTable, newsletterSubscribersTable, donationsTable, newsArticlesTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { GetAdminSummaryResponse } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/admin/summary", requireAdmin, async (_req, res): Promise<void> => {
  const [totalContactMessages] = await db.select({ count: count() }).from(contactMessagesTable);
  const [unreadContactMessages] = await db.select({ count: count() }).from(contactMessagesTable).where(eq(contactMessagesTable.read, false));
  const [totalVolunteers] = await db.select({ count: count() }).from(volunteerApplicationsTable);
  const [pendingVolunteers] = await db.select({ count: count() }).from(volunteerApplicationsTable).where(eq(volunteerApplicationsTable.status, "pending"));
  const [totalPartnerships] = await db.select({ count: count() }).from(partnershipEnquiriesTable);
  const [pendingPartnerships] = await db.select({ count: count() }).from(partnershipEnquiriesTable).where(eq(partnershipEnquiriesTable.status, "pending"));
  const [totalSubscribers] = await db.select({ count: count() }).from(newsletterSubscribersTable);
  const [totalDonations] = await db.select({ count: count() }).from(donationsTable);
  const [donationSum] = await db.select({ total: sum(donationsTable.amount) }).from(donationsTable);
  const [recentNewsCount] = await db.select({ count: count() }).from(newsArticlesTable).where(eq(newsArticlesTable.published, true));

  const summary = {
    totalContactMessages: totalContactMessages.count,
    unreadContactMessages: unreadContactMessages.count,
    totalVolunteers: totalVolunteers.count,
    pendingVolunteers: pendingVolunteers.count,
    totalPartnerships: totalPartnerships.count,
    pendingPartnerships: pendingPartnerships.count,
    totalSubscribers: totalSubscribers.count,
    totalDonations: totalDonations.count,
    totalDonationAmount: Number(donationSum.total ?? 0),
    recentNewsCount: recentNewsCount.count,
  };

  res.json(GetAdminSummaryResponse.parse(summary));
});

// Lets the admin UI ask "am I allowed in?" so non-admins get a clear message instead of broken pages.
router.get("/admin/me", requireAdmin, (_req, res): void => {
  res.json({ admin: true });
});

export default router;
