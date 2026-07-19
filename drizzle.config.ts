import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
  // SAFETY — this Supabase project is shared with 15+ unrelated products
  // (~737 tables in `public`, owned by the same `postgres` role we connect as).
  // Without these filters, drizzle-kit diffs our 13 tables against ALL of them
  // and emits DROP TABLE for every table it does not know about.
  // Do not remove. Do not widen.
  schemaFilter: ["public"],
  tablesFilter: ["sportsplatform_*"],
});
