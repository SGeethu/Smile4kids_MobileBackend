const UserModel = require('./signupModels');

class SignupController {
    async createUser(req, res) {
        const { username, email_id, password, confirm_password } = req.body;

        if (!username || !email_id || !password || !confirm_password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password !== confirm_password) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
try {
    const user = await UserModel.create(req.body);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      // Duplicate username or email
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    next(err); // Pass other errors to error handler
  }
}

    async updateProfile(req, res) {
        const { email_id, dob, ph_no, address, avatar } = req.body;
        if (!email_id) {
            return res.status(400).json({ message: 'Email is required' });
        }
        try {
            await UserModel.updateProfile({ email_id, dob, ph_no, address, avatar });
            return res.json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error("Update profile error:", error); // Add this
            return res.status(500).json({
                message: 'Error updating profile',
                error: error.message || error.toString()
            });
        }
    }

    async getProfile(req, res) {
        const { email_id } = req.query;
        if (!email_id) {
            return res.status(400).json({ message: 'Email is required' });
        }
        try {
            const user = await UserModel.findByEmail(email_id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Exclude password fields from response
            const { password, confirm_password, ...profile } = user;
            res.json(profile);
        } catch (error) {
            console.error("Get profile error:", error); // Add this
            res.status(500).json({
                message: 'Error fetching profile',
                error: error.message || error.toString()
            });
        }
    }
}

module.exports = SignupController;