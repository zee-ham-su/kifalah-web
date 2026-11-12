import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const volunteerApplicationsTable = pgTable("volunteer_applications", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  location: text("location").notNull(),
  skills: text("skills").notNull(),
  areaOfInterest: text("area_of_interest").notNull(),
  availability: text("availability").notNull(),
  motivation: text("motivation").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertVolunteerApplicationSchema = createInsertSchema(volunteerApplicationsTable).omit({ id: true, status: true, createdAt: true });
export type InsertVolunteerApplication = z.infer<typeof insertVolunteerApplicationSchema>;
export type VolunteerApplication = typeof volunteerApplicationsTable.$inferSelect;
