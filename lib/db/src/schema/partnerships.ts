import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const partnershipEnquiriesTable = pgTable("partnership_enquiries", {
  id: serial("id").primaryKey(),
  organisationName: text("organisation_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organisationType: text("organisation_type").notNull(),
  website: text("website"),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPartnershipEnquirySchema = createInsertSchema(partnershipEnquiriesTable).omit({ id: true, status: true, createdAt: true });
export type InsertPartnershipEnquiry = z.infer<typeof insertPartnershipEnquirySchema>;
export type PartnershipEnquiry = typeof partnershipEnquiriesTable.$inferSelect;
