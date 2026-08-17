const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient reference is required']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Notification description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Notification category is required'],
    enum: {
      values: ['Policy Update', 'Application Alert', 'Scheme Update', 'System Alert'],
      message: 'Category must be Policy Update, Application Alert, Scheme Update, or System Alert'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['HIGH', 'NORMAL', 'LOW'],
      message: 'Priority must be HIGH, NORMAL, or LOW'
    },
    default: 'NORMAL'
  },
  unread: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  aiInsight: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  iconType: {
    type: String,
    trim: true
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  associatedResourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  associatedResourceType: {
    type: String,
    enum: ['Policy', 'Scheme', 'Application']
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
