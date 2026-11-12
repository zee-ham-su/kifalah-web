import { pgTable, text, serial, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const donationsTable = pgTable("donations", {
  id: serial("id").primaryKey(),
  donorName: text("donor_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  amount: doublePrecision("amount"), // optional: a pledge can be in-kind support only
  currency: text("currency").notNull().default("GHS"),
  frequency: text("frequency").notNull().default("one-time"),
  programme: text("programme"),
  inKindSupport: text("in_kind_support"),
  message: text("message"),
  paymentMethod: text("payment_method"),
  // pledged | received | follow_up. A pledge is intent only; the site never processes payment.
  status: text("status").notNull().default("pledged"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDonationSchema = createInsertSchema(donationsTable).omit({ id: true, status: true, createdAt: true });
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donationsTable.$inferSelect;
