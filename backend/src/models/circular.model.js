const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Circular', circularSchema);
