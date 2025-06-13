const db = require('../db');

class ForgotModel {
  static findByEmail(email_id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email_id = ?', [email_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

  static saveOTP(email_id, otp) {
    return new Promise((resolve, reject) => {
      db.query('UPDATE users SET otp = ? WHERE email_id = ?', [otp, email_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static verifyOTP(email_id, otp) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email_id = ? AND otp = ?', [email_id, otp], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

static updatePassword(email_id, new_password) {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE users SET password = ?, confirm_password = ?, otp = NULL WHERE email_id = ?',
      [new_password, new_password, email_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}
}
module.exports = ForgotModel;