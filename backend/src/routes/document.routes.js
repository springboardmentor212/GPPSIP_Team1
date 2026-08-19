const express = require('express');
const router = express.Router();
const Document = require('../models/document.model');
const upload = require('../middlewares/upload.middleware');
const identifyUser = require('../middlewares/auth.middleware');

router.use(identifyUser);

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    const doc = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      linkedTo: req.body.linkedId,
      onModel: req.body.onModel
    });
    
    res.json({ success: true, document: doc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json({ success: true, documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
