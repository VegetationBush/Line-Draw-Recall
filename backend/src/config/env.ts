import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

console.log('DATABASE_URL:', process.env.DATABASE_URL);