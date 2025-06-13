require('dotenv').config();
const mysql = require('mysql2/promise'); // Use promise API

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // will be '' (empty string) if blank in .env
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Log every query (for debugging)
pool.on('connection', (connection) => {
  connection.on('enqueue', (sequence) => {
    if (sequence.sql) {
      console.log(`[DB QUERY] ${sequence.sql}`);
    }
  });
});

console.log('MySQL connection pool created!');

async function initializeDatabase() {
  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      users_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email_id VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      confirm_password VARCHAR(255) NOT NULL,
      otp VARCHAR(10),
      dob DATE,
      ph_no VARCHAR(20),
      address VARCHAR(255),
      avatar VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create videos table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      language VARCHAR(50) NOT NULL,
      level VARCHAR(50) NOT NULL,
      path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Create images table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      path VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Seed images table if empty
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM images');
  if (rows[0].count === 0) {
    await pool.query(`
      INSERT INTO images (path) VALUES
      ('/assets/images/1749622914064.png'),
      ('/assets/images/1749622929458.png'),
      ('/assets/images/1749622934180.png'),
      ('/assets/images/1749622938374.png'),
      ('/assets/images/1749622943563.png'),
      ('/assets/images/1749622948350.png'),
      ('/assets/images/1749622953080.png'),
      ('/assets/images/1749622957100.png'),
      ('/assets/images/1749622960003.png'),
      ('/assets/images/1749622965295.png')
    `);
    console.log('Seeded images table with initial data.');
  }
}

initializeDatabase().catch(err => {
  console.error('Database initialization failed:', err);
});

module.exports = pool;