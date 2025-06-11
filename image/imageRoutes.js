const express = require('express');
const multer = require('multer');
const path = require('path');
const ImageModel = require('./imageModel');
const router = express.Router();

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/images'); // Save to assets/images folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage: storage });

// Get all images
router.get('/', async (req, res) => {
  try {
    const images = await ImageModel.getAll();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get image by id
router.get('/:id', async (req, res) => {
  try {
    const image = await ImageModel.getById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imagePath = `/assets/images/${req.file.filename}`;
  try {
    const image = await ImageModel.save(imagePath);
    res.json({ message: 'Image uploaded', image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;