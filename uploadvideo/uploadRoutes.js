const express = require('express');
const multer = require('multer');
const { Readable } = require('stream');
const cloudinary = require('../cloudinaryConfig');

const router = express.Router();

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'smile4kids_videos' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      bufferStream.pipe(stream);
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
