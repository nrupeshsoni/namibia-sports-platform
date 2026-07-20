import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedSQL = readFileSync(join(__dirname, '../supabase/seed.sql'), 'utf8');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Copy .env.example → .env and fill in values.');
  process.exit(1);
}

// Prefer DATABASE_URL (session pooler on 5432 or transaction pooler on 6543).
// Special characters in the password must be URL-encoded in the connection string.
const sql = postgres(DATABASE_URL, {
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

console.log('Applying seed data to Supabase...');
try {
  await sql.unsafe(seedSQL);
  console.log('Seed applied successfully!');
} catch (e) {
  console.error('Error:', e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
