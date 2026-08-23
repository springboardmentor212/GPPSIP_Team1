const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Policy title is required'], trim: true },
  description: { type: String, required: [true, 'Policy description is required'], trim: true },
  content: { type: String, default: '', trim: true },
  documentUrl: { type: String, default: '' },
  department: { type: String, required: [true, 'Department is required'], trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Education', 'Healthcare', 'Agriculture', 'Employment', 'Finance',
      'Women & Child Welfare', 'Housing', 'Environment', 'Digital Governance', 'Infrastructure'
    ]
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Approved', 'Rejected', 'Archived'],
    default: 'Draft'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalHistory: [{
    fromStatus: { type: String, required: true },
    toStatus: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
