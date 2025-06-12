const ForgotModel = require('./forgotModels');
const nodemailer = require('nodemailer');

class ForgotController {
  async sendOTP(req, res) {
    const { email_id } = req.body;
    if (!email_id) return res.status(400).json({ message: 'Email is required' });

    try {
      const user = await ForgotModel.findByEmail(email_id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await ForgotModel.saveOTP(email_id, otp);

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email_id,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
      });

      res.json({ message: 'OTP sent to your email' });
    } catch (err) {
      res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
  }

  async verifyOTP(req, res) {
    const { email_id, otp } = req.body;
    if (!email_id || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    try {
      const user = await ForgotModel.verifyOTP(email_id, otp);
      if (!user) return res.status(400).json({ message: 'Invalid OTP' });

      res.json({ message: 'OTP verified. You can now reset your password.' });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }

  async resetPassword(req, res) {
    const { email_id, otp, new_password, confirm_password } = req.body;

    if (!email_id || !otp || !new_password || !confirm_password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Fetch user
      const user = await ForgotModel.findByEmail(email_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      // Do not allow old password to be reused
      if (user.password === new_password) {
        return res.status(400).json({ message: 'New password must be different from the old password' });
      }

      // Check new password match
      if (new_password !== confirm_password) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Update password
      await ForgotModel.updatePassword(email_id, new_password);

      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }

  async changePassword(req, res) {
    const { current_password, new_password, confirm_password } = req.body;

    // Get user info from authentication middleware (e.g., req.user)
    const user = req.user; // This should be set by your auth middleware

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (new_password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
      // 1. Check current password
      if (user.password !== current_password) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // 2. Update password
      await ForgotModel.updatePassword(user.email_id, new_password);
      res.json({ message: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Database error', error: err.message });
    }
  }
}

module.exports = new ForgotController();
// This code defines a ForgotController class that handles the logic for sending OTPs, verifying them, and resetting passwords.
// It uses the ForgotModel to interact with the database and nodemailer to send emails.