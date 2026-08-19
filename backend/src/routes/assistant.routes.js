const express = require('express');
const router = express.Router();
const identifyUser = require('../middlewares/auth.middleware');

// In-memory mock for AI Assistant
router.post('/ask', identifyUser, (req, res) => {
    const { question } = req.body;
    res.json({
        success: true,
        answer: `This is an AI-generated answer for: "${question}". Based on our policy database, you can find relevant details in the latest government schemes.`,
        citations: [
            { id: '1', title: 'National Health Policy 2024' },
            { id: '2', title: 'Digital India Act' }
        ]
    });
});

router.get('/suggestions', identifyUser, (req, res) => {
    res.json({
        success: true,
        suggestions: [
            "What are the eligibility criteria for PM-Kisan?",
            "How do I apply for a student loan subsidy?",
            "What is the new Digital Data Protection Act?"
        ]
    });
});

module.exports = router;
