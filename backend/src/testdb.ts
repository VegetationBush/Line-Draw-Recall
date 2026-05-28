import '@/config/env'
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful:', result.rows);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
})();