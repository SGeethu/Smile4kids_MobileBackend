const db = require('../db');

class ForgotModel {
  static async findByEmail(email_id) {
    const [rows] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);
    return rows[0];
  }

  static async saveOTP(email_id, otp) {
    const [results] = await db.query('UPDATE users SET otp = ? WHERE email_id = ?', [otp, email_id]);
    return results;
  }

  static async verifyOTP(email_id, otp) {
    const [rows] = await db.query('SELECT * FROM users WHERE email_id = ? AND otp = ?', [email_id, otp]);
    return rows[0];
  }

  static async updatePassword(email_id, new_password) {
    const [results] = await db.query(
      'UPDATE users SET password = ?, confirm_password = ?, otp = NULL WHERE email_id = ?',
      [new_password, new_password, email_id]
    );
    return results;
  }
}

module.exports = ForgotModel;