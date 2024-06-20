import { defineConfig } from "drizzle-kit";

import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  schema: "./app/db/schema.ts",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});
