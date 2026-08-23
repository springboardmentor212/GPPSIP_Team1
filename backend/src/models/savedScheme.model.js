const mongoose = require('mongoose');

const savedSchemeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  }
}, { timestamps: true });

// Ensure a user can only save a scheme once
savedSchemeSchema.index({ user: 1, scheme: 1 }, { unique: true });

const SavedScheme = mongoose.model('SavedScheme', savedSchemeSchema);
module.exports = SavedScheme;
