const db = require('../db');

class ImageModel {
  static async save(path) {
    const result = await db.query('INSERT INTO images (path) VALUES (?)', [path]);
    return { id: result.insertId, path };
  }

  static async getAll() {
    return await db.query('SELECT * FROM images');
  }

  static async getById(id) {
    const rows = await db.query('SELECT * FROM images WHERE id = ?', [id]);
    return rows[0];
  }
}

module.exports = ImageModel;