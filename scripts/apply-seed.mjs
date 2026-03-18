import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedSQL = readFileSync(join(__dirname, '../supabase/seed.sql'), 'utf8');

// Use session pooler (port 5432) with URL-encoded password
// Password: N@mibia!23Sports -> N%40mibia!23Sports
const sql = postgres({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  username: 'postgres.rbibqjgsnrueubrvyqps',
  password: 'N@mibia!23Sports',
  ssl: 'require',
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

console.log('Applying seed data to Supabase...');
try {
  await sql.unsafe(seedSQL);
  console.log('✅ Seed applied successfully!');
} catch (e) {
  console.error('❌ Error:', e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
