const express = require('express');
const router = express.Router();

router.post('/forgot-password', (req, res) => {
    res.json({ success: true, message: "Password reset link sent to your email." });
});

router.post('/reset-password', (req, res) => {
    res.json({ success: true, message: "Password has been successfully reset." });
});

module.exports = router;
