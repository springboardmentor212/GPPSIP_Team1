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
    enum: ['Draft', 'Pending', 'Approved', 'Archived'],
    default: 'Draft'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Policy = mongoose.model('Policy', policySchema);
module.exports = Policy;
