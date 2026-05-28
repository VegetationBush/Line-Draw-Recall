// test-db.ts
import dotenv from 'dotenv';
import path from 'path';
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const { Pool } = pg;

async function testConnection() {
  console.log("Attempting to connect to:", process.env.DATABASE_URL);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Connection successful!");
    console.log("Database time:", result.rows[0]);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();