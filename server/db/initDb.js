const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️ DATABASE_URL is not set in server/.env. Skipping remote PostgreSQL initialization.');
    return;
  }

  const needsSsl = connectionString.includes('neon.tech') || 
                   connectionString.includes('sslmode=require') || 
                   process.env.NODE_ENV === 'production';

  const pool = new Pool({
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000,
  });

  try {
    console.log('🔄 Connecting to PostgreSQL (Neon)...');
    const client = await pool.connect();
    console.log('✅ Connected successfully to PostgreSQL.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const seedSql = fs.readFileSync(seedPath, 'utf8');

    console.log('🔄 Applying schema...');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully.');

    console.log('🔄 Seeding initial records...');
    await client.query(seedSql);
    console.log('✅ Seed data applied successfully.');

    // Verification queries
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const plotsCount = await client.query('SELECT COUNT(*) FROM plots');
    const reportsCount = await client.query('SELECT COUNT(*) FROM satellite_reports');
    const creditsCount = await client.query('SELECT COUNT(*) FROM nft_credits');

    console.log('\n📊 Database Status Summary:');
    console.log(`- Users: ${usersCount.rows[0].count}`);
    console.log(`- Plots: ${plotsCount.rows[0].count}`);
    console.log(`- Satellite Reports: ${reportsCount.rows[0].count}`);
    console.log(`- NFT Credits: ${creditsCount.rows[0].count}`);

    client.release();
    await pool.end();
    console.log('🎉 Database initialization complete.\n');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
