const db = require('../db');

class VideoModel {
  static save({ filename, language, level, path }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO videos (filename, language, level, path) VALUES (?, ?, ?, ?)';
      db.query(sql, [filename, language, level, path], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  }

  static getAll() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM videos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getByCategory(language, level) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM videos WHERE language = ? AND level = ?';
      db.query(sql, [language, level], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = VideoModel;
