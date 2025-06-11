const db = require('../db');

class UserModel {
    static create({ username, email_id, password, confirm_password, dob = null, ph_no = null, address = null }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (username, email_id, password, confirm_password, dob, ph_no, address) VALUES (?, ?, ?, ?, ?, ?, ?)';
            db.query(query, [username, email_id, password, confirm_password, dob, ph_no, address], (err, results) => {
                if (err) return reject(err);
                resolve({ id: results.insertId, username, email_id, dob, ph_no, address });
            });
        });
    }

    static updateProfile({ email_id, dob, ph_no, address }) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET dob = ?, ph_no = ?, address = ? WHERE email_id = ?';
            db.query(query, [dob, ph_no, address, email_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static findByEmail(email_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email_id = ?';
            db.query(query, [email_id], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });
    }
}
module.exports = UserModel;