import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "http://localhost:3306/",
  user: "amos-kenya-emr",
  database: "kenya-emr-payments",
  password: "kenyaemr",
});

export const db = drizzle(connection);
