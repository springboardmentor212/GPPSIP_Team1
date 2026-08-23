const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: false
  },
  documentUrl: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number], // Array of floats
    required: false
  }
}, { timestamps: true });

// Create text index for fallback search
documentChunkSchema.index({ text: 'text' });

const DocumentChunk = mongoose.model('DocumentChunk', documentChunkSchema);
module.exports = DocumentChunk;
