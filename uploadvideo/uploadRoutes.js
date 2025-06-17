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

    res.json({
      title: req.body.title,
      videourl: result.secure_url, // This is the Cloudinary URL
      thumbnailUrl: req.body.thumbnailUrl,
      description: req.body.description
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;
