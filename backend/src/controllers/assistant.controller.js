const ChatSession = require('../models/chatSession.model');
const ChatMessage = require('../models/chatMessage.model');
const Policy = require('../models/policy.model');
const Scheme = require('../models/scheme.model');

/**
 * @desc Get all chat sessions for the logged in user
 * @route GET /api/assistant/sessions
 */
const getSessions = async (req, res, next) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user.id })
            .sort({ updatedAt: -1 });
        res.status(200).json({ success: true, sessions });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Get a specific chat session and its messages
 * @route GET /api/assistant/sessions/:id
 */
const getSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
        
        const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, session, messages });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Create or continue a chat session
 * @route POST /api/assistant/chat
 */
const chat = async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, userId: req.user.id });
        }
        
        if (!session) {
            const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
            session = await ChatSession.create({ userId: req.user.id, title });
        }

        const userMsg = await ChatMessage.create({
            sessionId: session._id,
            role: 'user',
            content: message
        });

        // Simple RAG-lite implementation: Search Database for keywords
        const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
        const searchRegex = new RegExp(keywords.join('|'), 'i');

        const policies = await Policy.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { content: searchRegex }
            ]
        }).limit(2);

        const schemes = await Scheme.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex }
            ]
        }).limit(2);

        let responseContent = "I'm PolicyGPT, your AI assistant. ";
        let citations = [];

        if (policies.length === 0 && schemes.length === 0) {
            // General conversation handling
            if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
                responseContent = "Hello! I am PolicyGPT. How can I help you discover policies and schemes today?";
            } else {
                responseContent += "I couldn't find any specific policies or schemes matching your query. Could you please provide more details or try different keywords?";
            }
        } else {
            responseContent += "Based on my knowledge base, here are some relevant resources I found:\n\n";
            
            policies.forEach(p => {
                responseContent += `- **${p.title}**: ${p.description ? p.description.substring(0, 120) : 'No description'}...\n`;
                citations.push({ title: p.title, link: `/dashboard?tab=policies`, id: p._id });
            });

            schemes.forEach(s => {
                responseContent += `- **${s.title}**: ${s.description ? s.description.substring(0, 120) : 'No description'}...\n`;
                citations.push({ title: s.title, link: `/schemes/${s._id}`, id: s._id });
            });
            
            responseContent += "\nYou can click the citations below to read more about them.";
        }

        const assistantMsg = await ChatMessage.create({
            sessionId: session._id,
            role: 'assistant',
            content: responseContent,
            citations: citations
        });

        session.updatedAt = new Date();
        await session.save();

        res.status(200).json({
            success: true,
            sessionId: session._id,
            message: assistantMsg
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc Delete a session
 * @route DELETE /api/assistant/sessions/:id
 */
const deleteSession = async (req, res, next) => {
    try {
        const session = await ChatSession.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
        
        await ChatMessage.deleteMany({ sessionId: req.params.id });
        res.status(200).json({ success: true, message: 'Session deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSessions,
    getSession,
    chat,
    deleteSession
};
