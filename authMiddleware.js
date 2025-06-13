const jwt = require('jsonwebtoken');
const db = require('./db'); // Use db.js, not setup.js

module.exports = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Fetch user from DB for latest info
    const [rows] = await db.query('SELECT * FROM users WHERE users_id = ?', [decoded.users_id]);
    if (!rows.length) return res.status(401).json({ message: 'Unauthorized' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};