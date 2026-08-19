const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Chat Session' },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatMessage' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);
