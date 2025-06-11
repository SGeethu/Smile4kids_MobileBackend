const LoginModel = require('./loginModels');
const jwt = require('jsonwebtoken');

class LoginController {
  async login(req, res) {
    const { email_id, password, rememberMe } = req.body;
    if (!email_id || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const user = await LoginModel.findByEmail(email_id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Set token expiration based on rememberMe
      const expiresIn = rememberMe ? '7d' : '1h';

      const token = jwt.sign(
        { users_id: user.users_id, username: user.username, email_id: user.email_id },
        process.env.JWT_SECRET,
        { expiresIn }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          users_id: user.users_id,
          username: user.username,
          email_id: user.email_id
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }
}

module.exports = new LoginController();