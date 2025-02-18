const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  contractorName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  isBlocked: { type: Boolean, default: false },
  numberOfEmployees: { type: Number, required: true, min: 2 },
  jobTypes: { type: [String], required: true },
  profilePicture: { type: String },
  gstNumber: { type: String },
  gstDocument: { type: String },
  licenseDocument: { type: String },
  registrationStep: { type: Number, enum: [1, 2], default: 1 },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Contractor', contractorSchema);