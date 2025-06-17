// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const signupRoutes = require('./signup/signupRoutes');
const loginRoutes = require('./login/loginRoutes');
const forgotRoutes = require('./forgot/forgotRoutes');
const uploadRoutes = require('./uploadvideo/uploadRoutes');
const imageRoutes = require('./image/imageRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware: Logging
app.use((req, res, next) => {
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`;
  console.log(logEntry);
  next();
});

// Middleware: Log JSON response
app.use((req, res, next) => {
  const oldJson = res.json;
  res.json = function (data) {
    console.log('Response data:', data);
    oldJson.call(this, data);
  };
  next();
});

// Middleware: Request timing
app.use((req, res, next) => {
  req._startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - req._startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Routes
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/forgot', forgotRoutes);
app.use('/videos', uploadRoutes);
app.use('/api/images', imageRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
