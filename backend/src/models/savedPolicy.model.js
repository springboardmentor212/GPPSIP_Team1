const mongoose = require('mongoose');

const savedPolicySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  }
}, { timestamps: true });

// Ensure a user can only save a policy once
savedPolicySchema.index({ user: 1, policy: 1 }, { unique: true });

const SavedPolicy = mongoose.model('SavedPolicy', savedPolicySchema);
module.exports = SavedPolicy;
