import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL тохируулагдаагүй байна.");
}

export const pool = new Pool({
  connectionString,
});
