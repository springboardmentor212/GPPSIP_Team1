const express = require('express');
const router = express.Router();
const Circular = require('../models/circular.model');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', async (req, res) => {
    const circulars = await Circular.find().sort({ createdAt: -1 });
    res.json({ success: true, circulars });
});

router.post('/', protect, async (req, res) => {
    const circular = await Circular.create(req.body);
    res.json({ success: true, circular });
});

module.exports = router;
