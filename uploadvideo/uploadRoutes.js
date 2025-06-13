const express = require('express');
const multer = require('multer');
const path = require('path');
const VideoModel = require('./videoModel');

const router = express.Router();

// Configure multer storage for both video and thumbnail
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, path.join(__dirname, '../uploads/videos'));
    } else if (file.fieldname === 'thumbnail') {
      cb(null, path.join(__dirname, '../uploads/thumbnails'));
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Live upload endpoint (accepts both video and thumbnail)
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  // Validate required fields
  const { language, level, title, description } = req.body;
  if (!language || !level) {
    return res.status(400).json({ message: 'Language and level are required' });
  }
  if (!req.files || !req.files['video']) {
    return res.status(400).json({ message: 'No video file uploaded' });
  }

  const videoFile = req.files['video'][0];
  const thumbnailFile = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;

  const videoPath = `uploads/videos/${videoFile.filename}`;
  const thumbnailPath = thumbnailFile ? `uploads/thumbnails/${thumbnailFile.filename}` : '';

  try {
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
    res.json({
      _id: videoId,
      title: title || videoFile.originalname,
      videoUrl: `${baseUrl}/${videoPath.replace(/\\/g, '/')}`,
      thumbnailUrl: thumbnailPath ? `${baseUrl}/${thumbnailPath.replace(/\\/g, '/')}` : null,
      description: description || ''
    });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// List all videos endpoint (for frontend to fetch)
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
    res.json(videosWithUrl);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
