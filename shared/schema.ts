import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: varchar("company"),
  subscriptionPlan: varchar("subscription_plan").default("free"), // free, premium
  creditsRemaining: integer("credits_remaining").default(3), // crediti per utenti free
  lastCreditsReset: timestamp("last_credits_reset").defaultNow(), // ultimo reset crediti
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Niche profiles table
export const nicheProfiles = pgTable("niche_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetAudience: text("target_audience").notNull(),
  contentGoal: varchar("content_goal").notNull(), // informare, vendere, intrattenere, autorita
  toneOfVoice: varchar("tone_of_voice").notNull(), // formale, amichevole, tecnico, umoristico, empatico
  keywords: text("keywords"), // comma-separated
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated content table
export const generatedContent = pgTable("generated_content", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  nicheProfileId: integer("niche_profile_id").notNull().references(() => nicheProfiles.id, { onDelete: "cascade" }),
  contentType: varchar("content_type").notNull(), // facebook, instagram, product, blog, video
  inputData: jsonb("input_data").notNull(), // original input from user
  generatedText: text("generated_text").notNull(),
  rating: integer("rating"), // user feedback 1-5 or thumbs up/down
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  nicheProfiles: many(nicheProfiles),
  generatedContent: many(generatedContent),
}));

export const nicheProfilesRelations = relations(nicheProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [nicheProfiles.userId],
    references: [users.id],
  }),
  generatedContent: many(generatedContent),
}));

export const generatedContentRelations = relations(generatedContent, ({ one }) => ({
  user: one(users, {
    fields: [generatedContent.userId],
    references: [users.id],
  }),
  nicheProfile: one(nicheProfiles, {
    fields: [generatedContent.nicheProfileId],
    references: [nicheProfiles.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertNicheProfileSchema = createInsertSchema(nicheProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedContentSchema = createInsertSchema(generatedContent).omit({
  id: true,
  createdAt: true,
});

export const updateNicheProfileSchema = insertNicheProfileSchema.partial().extend({
  id: z.number(),
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertNicheProfile = z.infer<typeof insertNicheProfileSchema>;
export type UpdateNicheProfile = z.infer<typeof updateNicheProfileSchema>;
export type NicheProfile = typeof nicheProfiles.$inferSelect;
export type InsertGeneratedContent = z.infer<typeof insertGeneratedContentSchema>;
export type GeneratedContent = typeof generatedContent.$inferSelect;
