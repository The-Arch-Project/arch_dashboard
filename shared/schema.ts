import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txId: text("tx_id").notNull(),
  date: timestamp("date").defaultNow(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  counterparty: text("counterparty"),
  userId: integer("user_id").references(() => users.id),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  txId: true,
  amount: true,
  currency: true,
  status: true,
  counterparty: true,
  userId: true,
});

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  key: text("key").notNull(),
  active: boolean("active").default(true),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  name: true,
  key: true,
  active: true,
  userId: true,
});

// Webhooks table
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  eventType: text("event_type").notNull(),
  active: boolean("active").default(true),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebhookSchema = createInsertSchema(webhooks).pick({
  url: true,
  eventType: true,
  active: true,
  userId: true,
});

// Yield Farming table
export const yieldFarming = pgTable("yield_farming", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  apy: numeric("apy").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  earned: numeric("earned").default("0"),
});

export const insertYieldFarmingSchema = createInsertSchema(yieldFarming).pick({
  userId: true,
  amount: true,
  currency: true,
  apy: true,
  endDate: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;

export type YieldFarming = typeof yieldFarming.$inferSelect;
export type InsertYieldFarming = z.infer<typeof insertYieldFarmingSchema>;
