import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const impactStatsTable = pgTable("impact_stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  description: text("description"),
  icon: text("icon").notNull().default("TrendingUp"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertImpactStatSchema = createInsertSchema(impactStatsTable).omit({ id: true });
export type InsertImpactStat = z.infer<typeof insertImpactStatSchema>;
export type ImpactStat = typeof impactStatsTable.$inferSelect;
