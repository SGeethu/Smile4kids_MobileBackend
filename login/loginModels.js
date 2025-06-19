const db = require('../db');

class LoginModel {
  static async updateLanguageAndAge({ users_id, language, age }) {
    await db.query(
      'UPDATE users SET language = ?, age = ? WHERE users_id = ?',
      [language, age, users_id]
    );
  }
  static async findByEmail(email_id) {
    const [results] = await db.query('SELECT * FROM users WHERE email_id = ?', [email_id]);
    return results[0];
  }
  static async getPreferencesById(users_id) {
    const [results] = await db.query('SELECT language, age FROM users WHERE users_id = ?', [users_id]);
    return results[0];
  }
}

module.exports = LoginModel;