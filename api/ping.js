const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  try {
    // Simple query to keep database active
    await pool.query('SELECT NOW()');

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ping error:', error);
    res.status(500).json({ error: 'Database ping failed' });
  }
};
