const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const VideoModel = require('./videoModel');

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { language, level } = req.query;
    if (!language || !level) {
      return cb(new Error('Language and level are required'), null);
    }
    const uploadPath = path.join(__dirname, '..', 'videos', language, level);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload endpoint
router.post('/upload', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { language, level } = req.query;
  const filePath = path.join('videos', language, level, req.file.filename);

  try {
    await VideoModel.save({
      filename: req.file.filename,
      language,
      level,
      path: filePath
    });

    res.json({
      message: 'Video uploaded and saved to database successfully',
      file: req.file,
      path: filePath
    });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get all videos
router.get('/list', async (req, res) => {
  try {
    const videos = await VideoModel.getAll();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Get videos by language and level
router.get('/by-category', async (req, res) => {
  const { language, level } = req.query;
  if (!language || !level) {
    return res.status(400).json({ message: 'language and level are required as query parameters' });
  }

  try {
    const videos = await VideoModel.getByCategory(language, level);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const videosWithUrl = videos.map(video => ({
      ...video,
      url: `${baseUrl}/${video.path.replace(/\\/g, '/')}` // normalize slashes
    }));

    res.json(videosWithUrl);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
