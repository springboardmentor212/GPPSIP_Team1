const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['General', 'Policy Update', 'Urgent', 'Tender', 'Recruitment'],
    default: 'General'
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  },
  expiryDate: { type: Date, required: false },
  documentUrl: { type: String, required: false }
}, { timestamps: true });

const Circular = mongoose.model('Circular', circularSchema);
module.exports = Circular;
