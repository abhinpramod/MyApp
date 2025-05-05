const mongoose = require('mongoose');

const contractorSchema = new mongoose.Schema({
  contractorName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  approvalStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  isBlocked: { type: Boolean, default: false },
  numberOfEmployees: { type: Number, required: true, min: 1 },
  jobTypes: { type: [String], required: true },
  profilePicture: { type: String },
  profilePicturePublicId: { type: String },
  gstNumber: { type: String },
  country: { type: String },
  availability: { type: Boolean, default: false },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  gstDocument: { type: String },
  licenseDocument: { type: String },
  registrationStep: { type: Number, enum: [1, 2], default: 1 },
  verified: { type: Boolean, default: false },
  description: { type: String, maxlength: 5000 },
  projects: [
    {
      description: { type: String, required: true },
      media: [
        {
          url: { type: String, required: true },
          type: { type: String, enum: ['image', 'video'], required: true },
          publicId: { type: String, required: true }
        }
      ],
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

module.exports = mongoose.model('Contractor', contractorSchema);