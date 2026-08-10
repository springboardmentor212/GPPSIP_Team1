const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant reference is required']
  },
  scheme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: [true, 'Scheme reference is required']
  },
  applicationId: {
    type: String,
    required: [true, 'Application ID is required'],
    unique: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
