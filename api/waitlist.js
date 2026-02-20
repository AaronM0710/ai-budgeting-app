const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Ensure waitlist table exists
async function ensureTableExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS waitlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(200),
      referral_source VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notified BOOLEAN DEFAULT FALSE
    );
    CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
    CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
  `;

  try {
    await pool.query(createTableQuery);
  } catch (error) {
    console.error('Table creation error:', error);
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      // Ensure table exists before any operations
      await ensureTableExists();

      const { email, name, referral_source } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      // Check if already on waitlist
      const existing = await pool.query(
        'SELECT id FROM waitlist WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existing.rows.length > 0) {
        // Get their position
        const position = await pool.query(
          'SELECT COUNT(*) as position FROM waitlist WHERE created_at <= (SELECT created_at FROM waitlist WHERE email = $1)',
          [email.toLowerCase()]
        );
        return res.status(200).json({
          message: 'You are already on the waitlist!',
          waitlist_position: parseInt(position.rows[0].position)
        });
      }

      // Insert into waitlist
      await pool.query(
        'INSERT INTO waitlist (email, name, referral_source) VALUES ($1, $2, $3)',
        [email.toLowerCase(), name || null, referral_source || null]
      );

      // Get position
      const position = await pool.query('SELECT COUNT(*) as position FROM waitlist');

      return res.status(201).json({
        message: 'Successfully joined the waitlist!',
        waitlist_position: parseInt(position.rows[0].position)
      });

    } catch (error) {
      console.error('Waitlist error:', error);
      return res.status(500).json({ error: 'Failed to join waitlist' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
