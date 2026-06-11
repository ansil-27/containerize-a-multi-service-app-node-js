import dotenv from "dotenv";
import pg from "pg";
import path from "path";

// Support loading .env from the root directory
dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text, params) {
  return pool.query(text, params);
}
