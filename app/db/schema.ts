import { sql } from "drizzle-orm";
import {
  int,
  text,
  mysqlSchema,
  mysqlTable,
  timestamp,
} from "drizzle-orm/mysql-core";

export const schema = mysqlSchema("payments_schema");

export const payments = mysqlTable("payments", {
  id: int("id").primaryKey().autoincrement(),
  mfl: text("mfl").notNull(),
  billId: text("bill_id").notNull(),
  amount: text("amount").notNull(),
  phoneNumber: text("phone_number").notNull(),
  status: text("status", {
    enum: ["INITIATED", "COMPLETE", "FAILED"],
  }).notNull(),
  merchantReqId: text("merchant_req_id"),
  receiptNumber: text("receipt_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const claims = mysqlTable("claims", {
  id: int("id").primaryKey().autoincrement(),
  claimId: text("claim_id").notNull(),
  approvedAmount: int("approved_amount").notNull(),
  status: text("status").notNull(),
  commentFromApprover: text("comment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
