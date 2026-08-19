const express = require('express');
const router = express.Router();
const identifyUser = require('../middlewares/auth.middleware');

router.get('/', identifyUser, (req, res) => {
    res.json({
        success: true,
        profile: {
            ...req.user.toObject(),
            preferences: { notifications: true, newsletter: false },
            interests: ['Education', 'Healthcare']
        }
    });
});

router.put('/', identifyUser, (req, res) => {
    res.json({
        success: true,
        message: "Profile updated successfully",
        profile: { ...req.user.toObject(), ...req.body }
    });
});

module.exports = router;
