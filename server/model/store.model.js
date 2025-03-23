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
      type: String, // URL to GST document stored in Cloudinary
      required: false,
    },
    storeLicense: {
      type: String, // URL to store license document stored in Cloudinary
      required: false,
    },
    approved: {
      type: Boolean,
      default: false,
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
  },
  { timestamps: true }
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;