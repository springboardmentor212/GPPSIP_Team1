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
        }).limit(3);

        const schemes = await Scheme.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex }
            ]
        }).limit(3);

        const DocumentChunk = require('../models/documentChunk.model');
        const chunks = await DocumentChunk.find({
            text: searchRegex
        }).limit(5);

        let contextDocs = [];
        let citations = [];

        policies.forEach(p => {
            contextDocs.push(`Policy: ${p.title}\nDescription: ${p.description}\n`);
            citations.push({ title: p.title, link: `/dashboard?tab=policies`, id: p._id });
        });

        schemes.forEach(s => {
            contextDocs.push(`Scheme: ${s.title}\nDescription: ${s.description}\n`);
            citations.push({ title: s.title, link: `/schemes/${s._id}`, id: s._id });
        });
        
        chunks.forEach(c => {
            contextDocs.push(`Document Excerpt: "...${c.text.substring(0, 300)}..."\n`);
            citations.push({ title: 'Uploaded Document', link: c.documentUrl, id: c._id });
        });

        let contextString = contextDocs.length > 0 
            ? `Here is the relevant context from the database and uploaded documents:\n\n${contextDocs.join('\n')}\n\n`
            : "No specific policies, schemes, or documents were found for this query.\n\n";

        const systemPrompt = `You are PolicyGPT, a helpful and professional AI assistant for a Government Policy & Public Scheme Intelligence Platform.
Your goal is to answer the user's question based strictly on the provided context. If the answer is not in the context, do not make up information, but answer as best as you can in a general helpful manner.
Always be polite and structured in your response. Do not output raw markdown links or HTML. Keep the response concise but informative.
`;

        const geminiApiKey = process.env.GEMINI_API_KEY;
        let responseContent = "";

        if (!geminiApiKey) {
            responseContent = "I'm PolicyGPT. (Error: GEMINI_API_KEY is missing in the backend environment. Please configure it to enable the full AI capabilities). " + 
                (contextDocs.length > 0 ? "However, here is what I found in the database:\n\n" + contextDocs.join('\n') : "I couldn't find any resources for your query.");
        } else {
            // Call Gemini API via native fetch
            try {
                const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `${systemPrompt}\n\n${contextString}\n\nUser Question: ${message}`
                            }]
                        }]
                    })
                });

                const aiData = await aiResponse.json();
                
                if (aiData.candidates && aiData.candidates.length > 0) {
                    responseContent = aiData.candidates[0].content.parts[0].text;
                } else {
                    responseContent = "I'm sorry, I couldn't generate a response at this time.";
                }
            } catch (err) {
                console.error("Gemini API Error:", err);
                responseContent = "I'm sorry, I encountered an error communicating with the AI service. Please try again later.";
            }
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
