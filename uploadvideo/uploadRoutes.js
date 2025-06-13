const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const VideoModel = require('./videoModel');
const router = express.Router();

// Multer storage setup (directly in this file)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'video') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else if (file.fieldname === 'thumbnail') {
      uploadPath = path.join(__dirname, '../uploads/thumbnails');
    } else {
      return cb(new Error('Invalid field name'), null);
    }
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ==========================
// POST /upload - Upload video + thumbnail
// ==========================
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { language, level, title, description } = req.body;

    if (!language || !level) {
      return res.status(400).json({ message: 'Language and level are required' });
    }

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoPath = path.join('uploads/videos', videoFile.filename);
    const thumbnailPath = thumbnailFile ? path.join('uploads/thumbnails', thumbnailFile.filename) : null;

    const videoId = await VideoModel.save({
      filename: videoFile.filename,
      language,
      level,
      path: videoPath,
      title: title || videoFile.originalname,
      description: description || '',
      thumbnailUrl: thumbnailPath
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    res.status(200).json({
      _id: videoId,
      title: title || videoFile.originalname,
      videoUrl: `${baseUrl}/${videoPath.replace(/\\/g, '/')}`,
      thumbnailUrl: thumbnailPath ? `${baseUrl}/${thumbnailPath.replace(/\\/g, '/')}` : null,
      description: description || ''
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// ==========================
// GET /list - Get all uploaded videos
// ==========================
router.get('/list', async (req, res) => {
  try {
    const videos = await VideoModel.getAll();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const videosWithUrl = videos.map(video => ({
      _id: video.id,
      title: video.title || video.filename,
      videoUrl: `${baseUrl}/${video.path.replace(/\\/g, '/')}`,
      thumbnailUrl: video.thumbnailUrl
        ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${baseUrl}/${video.thumbnailUrl.replace(/\\/g, '/')}`)
        : null,
      description: video.description || ''
    }));

    res.status(200).json(videosWithUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
