import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const programmesTable = pgTable("programmes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description"),
  icon: text("icon").notNull().default("Star"),
  imageUrl: text("image_url"),
  goal: text("goal"),
  targetBeneficiaries: text("target_beneficiaries"),
  keyActivities: text("key_activities"),
  featured: boolean("featured").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProgrammeSchema = createInsertSchema(programmesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProgramme = z.infer<typeof insertProgrammeSchema>;
export type Programme = typeof programmesTable.$inferSelect;
