const db = require('../db');

class LoginModel {
  static findByEmail(email_id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email_id = ?';
      db.query(sql, [email_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
}

module.exports = LoginModel;