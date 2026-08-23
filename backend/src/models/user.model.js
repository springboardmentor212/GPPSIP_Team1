const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    trim: true,
    match: [/^\d{10}$/, 'Mobile number must be exactly 10 digits']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  role: {
    type: String,
    enum: {
      values: ['Citizen', 'Gov. Official', 'Researcher/NGO', 'Super Admin'],
      message: 'Role must be Citizen, Gov. Official, Researcher/NGO, or Super Admin'
    },
    default: 'Citizen',
    required: [true, 'Role is required']
  },
  occupation: { type: String, default: '' },
  education: { type: String, default: '' },
  income: { type: Number, default: 0 },
  interests: [{ type: String }],
  isActive: {
    type: Boolean,
    default: true
  },
  termsAccepted: {
    type: Boolean,
    required: [true, 'You must accept the terms of service'],
    // Ensure they must check the checkbox
    validate: {
      validator: function(v) { return v === true; },
      message: 'You must accept the terms of service'
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
