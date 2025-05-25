import { config } from "dotenv";
config(); // must be called before using process.env

import { Pool } from "pg";

console.log("🔌 Connecting to:", process.env.DATABASE_URL); // just for debug

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
