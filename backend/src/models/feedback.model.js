const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Response message is required'],
    trim: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender reference is required']
  },
  sentAt: {
    type: Date,
    default: Date.now
  }
});

const feedbackSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: [true, 'Ticket ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  categoryTag: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['IT & COMM', 'EDUCATION', 'AGRI', 'HEALTH'],
      message: 'Category must be IT & COMM, EDUCATION, AGRI, or HEALTH'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['NORMAL', 'HIGH', 'CRITICAL'],
      message: 'Priority must be NORMAL, HIGH, or CRITICAL'
    },
    default: 'NORMAL'
  },
  status: {
    type: String,
    enum: {
      values: ['OPEN', 'IN PROGRESS', 'RESOLVED'],
      message: 'Status must be OPEN, IN PROGRESS, or RESOLVED'
    },
    default: 'OPEN'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author reference is required']
  },
  assignedDepartment: {
    type: String,
    trim: true
  },
  responses: [responseSchema]
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
