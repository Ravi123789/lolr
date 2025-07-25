import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const ethosProfiles = pgTable("ethos_profiles", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").unique(),
  displayName: text("display_name"),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  description: text("description"),
  score: integer("score"),
  status: text("status"),
  userkeys: jsonb("userkeys"),
  xpTotal: integer("xp_total"),
  xpStreakDays: integer("xp_streak_days"),
  stats: jsonb("stats"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trustScores = pgTable("trust_scores", {
  id: serial("id").primaryKey(),
  userkey: text("userkey").notNull(),
  score: integer("score"),
  level: text("level"),
  lastCalculated: timestamp("last_calculated").defaultNow(),
});

export const watchedWallets = pgTable("watched_wallets", {
  id: serial("id").primaryKey(),
  userAddress: text("user_address").notNull(),
  watchedAddress: text("watched_address").notNull(),
  name: text("name"),
  alertThreshold: integer("alert_threshold").default(5),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trustActivities = pgTable("trust_activities", {
  id: serial("id").primaryKey(),
  targetUserkey: text("target_userkey").notNull(),
  activityType: text("activity_type").notNull(), // trust_received, score_change, review_received
  fromUserkey: text("from_userkey"),
  scoreChange: integer("score_change"),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Schemas
export const insertEthosProfileSchema = createInsertSchema(ethosProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrustScoreSchema = createInsertSchema(trustScores).omit({
  id: true,
  lastCalculated: true,
});

export const insertWatchedWalletSchema = createInsertSchema(watchedWallets).omit({
  id: true,
  createdAt: true,
});

export const insertTrustActivitySchema = createInsertSchema(trustActivities).omit({
  id: true,
  timestamp: true,
});

// Types
export type EthosProfile = typeof ethosProfiles.$inferSelect;
export type InsertEthosProfile = z.infer<typeof insertEthosProfileSchema>;

export type TrustScore = typeof trustScores.$inferSelect;
export type InsertTrustScore = z.infer<typeof insertTrustScoreSchema>;

export type WatchedWallet = typeof watchedWallets.$inferSelect;
export type InsertWatchedWallet = z.infer<typeof insertWatchedWalletSchema>;

export type TrustActivity = typeof trustActivities.$inferSelect;
export type InsertTrustActivity = z.infer<typeof insertTrustActivitySchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
