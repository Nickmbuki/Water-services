import { numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "admin"]);
export const serviceCategoryEnum = pgEnum("service_category", ["delivery", "borehole", "plumbing", "purification"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "in_progress", "completed"]);
export const paymentProviderEnum = pgEnum("payment_provider", ["mpesa", "paypal"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: serviceCategoryEnum("category").notNull(),
  basePrice: numeric("base_price", { precision: 12, scale: 2 }).notNull(),
  imageUrl: text("image_url").notNull()
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  serviceId: uuid("service_id").notNull().references(() => services.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("paid"),
  location: text("location").notNull(),
  scheduledDate: timestamp("scheduled_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  provider: paymentProviderEnum("provider").notNull(),
  transactionId: text("transaction_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  status: paymentStatusEnum("status").notNull().default("paid"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export type UserRecord = typeof users.$inferSelect;
export type ServiceRecord = typeof services.$inferSelect;
export type OrderRecord = typeof orders.$inferSelect;
export type PaymentRecord = typeof payments.$inferSelect;
