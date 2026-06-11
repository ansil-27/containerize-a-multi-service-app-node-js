import dotenv from "dotenv";
import pg from "pg";
import path from "path";

// Support loading .env from the root directory
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
dotenv.config(); // Also check local directory

const { Pool } = pg;

// AWS RDS usually requires SSL
const isAws = process.env.DATABASE_URL?.includes("amazonaws.com");

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isAws ? { rejectUnauthorized: false } : false
});

export async function query(text, params) {
  return pool.query(text, params);
}
