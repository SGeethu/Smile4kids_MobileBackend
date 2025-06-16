const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const VideoModel = require('./videoModel');
const router = express.Router();

// ==========================
// Multer Storage Configuration
// ==========================
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
// POST /upload
// ==========================
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { language, level, title, description } = req.body;

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!language || !level || !videoFile) {
      return res.status(400).json({ message: 'Language, level, and video are required' });
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
// GET /list - All videos
// ==========================
router.get('/list', async (req, res) => {
  try {
    const videos = await VideoModel.getAll();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const result = videos.map(video => ({
      _id: video.id,
      title: video.title || video.filename,
      videoUrl: `${baseUrl}/${video.path.replace(/\\/g, '/')}`,
      thumbnailUrl: video.thumbnailUrl
        ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${baseUrl}/${video.thumbnailUrl.replace(/\\/g, '/')}`)
        : null,
      description: video.description || ''
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// ==========================
// GET /by-category
// ==========================
router.get('/by-category', async (req, res) => {
  const { language, level } = req.query;
  if (!language || !level) {
    return res.status(400).json({ message: 'language and level are required' });
  }

  try {
    const videos = await VideoModel.getByCategory(language, level);
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const result = videos.map(video => ({
      _id: video.id,
      title: video.title || video.filename,
      videoUrl: `${baseUrl}/${video.path.replace(/\\/g, '/')}`,
      thumbnailUrl: video.thumbnailUrl
        ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${baseUrl}/${video.thumbnailUrl.replace(/\\/g, '/')}`)
        : null,
      description: video.description || ''
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Helper function to get videos by language and level
async function getVideosByCategory(req, res, language, level) {
  try {
    const videos = await VideoModel.getByCategory(language, level);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result = videos.map(video => ({
      _id: video.id,
      title: video.title || video.filename,
      videoUrl: `${baseUrl}/${video.path.replace(/\\/g, '/')}`,
      thumbnailUrl: video.thumbnailUrl
        ? (video.thumbnailUrl.startsWith('http') ? video.thumbnailUrl : `${baseUrl}/${video.thumbnailUrl.replace(/\\/g, '/')}`)
        : null,
      description: video.description || ''
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
}

// Hindi - Junior
router.get('/list/hindi/junior', (req, res) => getVideosByCategory(req, res, 'Hindi', 'junior'));

// Hindi - Pre Junior
router.get('/list/hindi/prejunior', (req, res) => getVideosByCategory(req, res, 'Hindi', 'pre junior'));

// Gujarati - Junior
router.get('/list/gujarati/junior', (req, res) => getVideosByCategory(req, res, 'Gujarati', 'junior'));

// Gujarati - Pre Junior
router.get('/list/gujarati/prejunior', (req, res) => getVideosByCategory(req, res, 'Gujarati', 'pre junior'));

// Panjabi - Junior
router.get('/list/panjabi/junior', (req, res) => getVideosByCategory(req, res, 'Panjabi', 'junior'));

// Panjabi - Pre Junior
router.get('/list/panjabi/prejunior', (req, res) => getVideosByCategory(req, res, 'Panjabi', 'pre junior'));

module.exports = router;
