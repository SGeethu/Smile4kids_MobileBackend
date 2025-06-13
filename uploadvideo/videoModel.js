const db = require('../db');

class VideoModel {
  static async save({ filename, language, level, path, title, description, thumbnailUrl }) {
    const [results] = await db.query(
      'INSERT INTO videos (filename, language, level, path, title, description, thumbnailUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [filename, language, level, path, title, description, thumbnailUrl]
    );
    return results.insertId;
  }

  static async getAll() {
    const [results] = await db.query('SELECT * FROM videos');
    return results;
  }

  static async getByCategory(language, level) {
    const [results] = await db.query(
      'SELECT * FROM videos WHERE language = ? AND level = ?',
      [language, level]
    );
    return results;
  }
}

module.exports = VideoModel;
