import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
  DB_URL,
} from "@/config/env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  database: DATABASE_NAME,
  password: DATABASE_PASSWORD,
  uri: DB_URL,
  keepAliveInitialDelay: 10000,
  enableKeepAlive: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(connection);
