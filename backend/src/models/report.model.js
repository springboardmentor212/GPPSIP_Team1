const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: [true, 'Report ID is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Report name is required'],
    trim: true
  },
  department: {
    type: String,
    trim: true,
    default: 'All Departments'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author reference is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Complete', 'Processing', 'Failed'],
      message: 'Status must be Complete, Processing, or Failed'
    },
    default: 'Processing'
  },
  statusType: {
    type: String,
    enum: {
      values: ['success', 'processing', 'danger'],
      message: 'StatusType must be success, processing, or danger'
    },
    default: 'processing'
  },
  format: {
    type: String,
    enum: {
      values: ['PDF', 'XLS', 'CSV'],
      message: 'Format must be PDF, XLS, or CSV'
    },
    required: [true, 'Report format is required']
  },
  fileUrl: {
    type: String,
    trim: true
  },
  fileSize: {
    type: String,
    trim: true,
    default: '0 KB'
  },
  filters: {
    dateRange: { type: String, default: '30d' },
    category: { type: String, default: 'all' },
    department: { type: String, default: 'all' },
    template: { type: String, default: 'Department Performance' }
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  frequency: {
    type: String,
    enum: {
      values: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
      message: 'Frequency must be Daily, Weekly, Monthly, or Yearly'
    }
  },
  executionTime: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
