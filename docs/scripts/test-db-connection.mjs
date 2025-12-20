import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres:N@mibia!23Sports@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres';

console.log('Testing database connection...');

try {
  const sql = postgres(DATABASE_URL);
  
  const result = await sql`SELECT COUNT(*) as total FROM namibia_na_26_federations`;
  console.log('✅ Connection successful!');
  console.log('Total federations in database:', result[0].total);
  
  await sql.end();
  process.exit(0);
} catch (error) {
  console.error('❌ Connection failed:', error.message);
  process.exit(1);
}
