import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
  timestamp,
} from "drizzle-orm/mysql-core";

export type Payment = {
  id: string;
  mfl: string;
  billId: string;
  createdAt: string;
  updatedAt: string;
};

export const payments = mysqlTable(
  "payments",
  {
    id: serial("id").primaryKey(),
    mfl: varchar("name", { length: 256 }),
    billId: varchar("name", { length: 256 }),
    status: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (payments) => ({
    nameIndex: uniqueIndex("id_idx").on(payments.id),
  })
);
