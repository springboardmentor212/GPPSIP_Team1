const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Scheme title is required'], trim: true },
  description: { type: String, required: [true, 'Scheme description is required'], trim: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Scholarships', 'Farmer Welfare', 'Healthcare', 'Housing', 'Business Support',
      'Women Empowerment', 'Senior Citizen Welfare', 'Student Schemes', 'Employment Programs', 'Social Security'
    ]
  },
  status: {
    type: String,
    enum: ['Active', 'Archived'],
    default: 'Active'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eligibilityRules: {
    age: { min: Number, max: Number },
    gender: String,
    income: { max: Number },
    occupation: String,
    education: String,
    location: String,
    socialCategory: String,
    disabilityStatus: Boolean
  }
}, { timestamps: true });

const Scheme = mongoose.model('Scheme', schemeSchema);
module.exports = Scheme;
