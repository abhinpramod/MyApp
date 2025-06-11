const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    storeType: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: false,
    },
    gstDocument: {
      type: String,
      required: false,
    },
    storeLicense: {
      type: String,
      required: false,
    },
    approvelstatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    registrationStep: {
      type: Number,
      default: 1,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    // New review fields
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);