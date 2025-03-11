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
  profilePicturePublicId: { type: String },
  gstNumber: { type: String },
  country: { type: String },
  availability: { type: Boolean, default: false },
  state: { type: String },
  city: { type: String },
  gstDocument: { type: String },
  licenseDocument: { type: String },
  registrationStep: { type: Number, enum: [1, 2], default: 1 },
  verified: { type: Boolean, default: false },
  projects: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      image: { type: String, required: true }, // Cloudinary URL
      description: { type: String, required: true }, // Project description
      createdAt: { type: Date, default: Date.now },
      imagePublicId: { type: String },
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model('Contractor', contractorSchema);