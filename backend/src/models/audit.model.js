const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Audit = mongoose.model('Audit', auditSchema);

module.exports = Audit;
