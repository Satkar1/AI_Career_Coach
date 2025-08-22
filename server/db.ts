import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Supabase connection
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  // Connection pool settings for production
  max: 20,
  idle_timeout: 20,
  connect_timeout: 60,
});

export const db = drizzle(client, { schema });
