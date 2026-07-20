import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Copy .env.example → .env and fill in values.');
  process.exit(1);
}

console.log('Testing database connection...');

try {
  const sql = postgres(DATABASE_URL, { ssl: 'require', max: 1 });

  const result = await sql`SELECT COUNT(*) as total FROM sportsplatform_federations`;
  console.log('Connection successful!');
  console.log('Total federations in database:', result[0].total);

  await sql.end();
  process.exit(0);
} catch (error) {
  console.error('Connection failed:', error.message);
  process.exit(1);
}
