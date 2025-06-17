const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');


const router = express.Router();

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    if (!req.files || !req.files.video || !req.files.video[0]) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    const videoBufferStream = new Readable();
    videoBufferStream.push(videoFile.buffer);
    videoBufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'smile4kids_videos' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      videoBufferStream.pipe(stream);
    });

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
