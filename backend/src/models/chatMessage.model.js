const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatSession', required: true },
    sender: { type: String, enum: ['user', 'ai'], required: true },
    content: { type: String, required: true },
    citations: [{ id: String, title: String }],
    bookmarked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
