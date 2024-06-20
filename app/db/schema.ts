import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const payments = sqliteTable("payments", {
  id: integer("id").notNull().primaryKey(),
  mfl: text("mfl").notNull(),
  billId: text("bill_id").notNull(),
  amount: text("amount").notNull(),
  phoneNumber: text("phone_number").notNull(),
  status: text("status", {
    enum: ["INITIATED", "COMPLETE", "FAILED"],
  }).notNull(),
  receiptNumber: text("receipt_number"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
