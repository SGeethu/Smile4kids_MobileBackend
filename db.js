// require('dotenv').config();
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'b0nkpbgwp21n7lznkaoi-mysql.services.clever-cloud.com',
//   user: 'ue21vikyihieghjf',
//   password: 'uCKficDt4i4gQrUJiZrs',
//   database: 'b0nkpbgwp21n7lznkaoi',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// module.exports = pool;
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mobile_backend', // Use environment variable for DB name
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;