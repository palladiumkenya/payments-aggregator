import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_USER,
  DB_URL,
} from "./config/env";

dotenv.config({
  path: ".env",
});

export default defineConfig({
  schema: "./app/db/schema.ts",
  dialect: "mysql",
  out: "./drizzle",
  dbCredentials: {
    url: DB_URL,
    database: DATABASE_NAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    user: DATABASE_USER,
  },
});
