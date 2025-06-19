const LoginModel = require('./loginModels');
const jwt = require('jsonwebtoken');

class LoginController {
  // Login and set preferences in one API
  async loginWithPreferences(req, res) {
    const { email_id, password, rememberMe, language, age } = req.body;
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

      // If language and age are provided, update them
      if (language && age) {
        await LoginModel.updateLanguageAndAge({ users_id: user.users_id, language, age });
      }

      res.json({
        message: 'Login successful',
        token,
        user: {
          users_id: user.users_id,
          username: user.username,
          email_id: user.email_id,
          language: language || user.language,
          age: age || user.age
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }

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
          email_id: user.email_id,
          language: user.language,
          age: user.age
        }
      });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }

  async getPreferences(req, res) {
    try {
      const users_id = req.user && req.user.users_id;
      if (!users_id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const prefs = await LoginModel.getPreferencesById(users_id);
      if (!prefs) {
        return res.status(404).json({ message: 'Preferences not found' });
      }
      res.json({ language: prefs.language, age: prefs.age });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching preferences', error: err.message });
    }
  }


  async updatePreferences(req, res) {
    const users_id = req.user && req.user.users_id;
    const { language, age } = req.body;
    if (!users_id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!language || !age) {
      return res.status(400).json({ message: 'Language and age are required' });
    }
    try {
      await LoginModel.updateLanguageAndAge({ users_id, language, age });
      res.json({ message: 'Preferences updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }
}
module.exports = new LoginController();