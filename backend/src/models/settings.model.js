const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: 'PolicyGPT'
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maxLoginAttempts: {
    type: Number,
    default: 5
  },
  jwtExpiryDays: {
    type: Number,
    default: 7
  },
  allowPublicRegistrations: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
