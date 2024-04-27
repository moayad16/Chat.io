import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

if (!process.env.DB_URL) {
  throw new Error("DB_URL not found in env");
}

const sql = neon(process.env.DB_URL);

export const db = drizzle(sql);
