const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Policy title is required'], trim: true },
  description: { type: String, required: [true, 'Policy description is required'], trim: true },
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
    enum: ['Draft', 'Pending Approval', 'Active', 'Under Review', 'Archived'],
    default: 'Draft'
  },
  version: { type: Number, default: 1 },
  previousVersions: [{
    version: Number,
    content: String,
    updatedAt: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
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
