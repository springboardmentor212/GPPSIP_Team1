const express = require('express');
const router = express.Router();
const ChatSession = require('../models/chatSession.model');
const ChatMessage = require('../models/chatMessage.model');
const identifyUser = require('../middlewares/auth.middleware');

router.use(identifyUser);

router.get('/sessions', async (req, res) => {
    try {
        const sessions = await ChatSession.find({ user: req.user._id }).sort({ updatedAt: -1 });
        res.json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/sessions', async (req, res) => {
    try {
        const session = await ChatSession.create({ user: req.user._id, title: req.body.title });
        res.json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/sessions/:id/messages', async (req, res) => {
    try {
        const messages = await ChatMessage.find({ session: req.params.id }).sort({ createdAt: 1 });
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/sessions/:id/messages', async (req, res) => {
    try {
        const message = await ChatMessage.create({
            session: req.params.id,
            sender: req.body.sender,
            content: req.body.content,
            citations: req.body.citations
        });
        await ChatSession.findByIdAndUpdate(req.params.id, { $push: { messages: message._id }, updatedAt: new Date() });
        res.json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
