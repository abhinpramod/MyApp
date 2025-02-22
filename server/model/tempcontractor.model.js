const mongoose = require('mongoose');

const tempcontractorSchema = new mongoose.Schema({
  contractorName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true,  },
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
  createdAt: { type: Date, default: Date.now, expires: "5m" }, // Auto-delete after 5 minutes


}, { timestamps: true });

module.exports = mongoose.model('TempContractor', tempcontractorSchema);