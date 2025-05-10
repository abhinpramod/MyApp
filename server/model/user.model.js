const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phoneNumber: { type: String },
    address: {
      country: { type: String },
      state: { type: String },
      city: { type: String },
      pincode: { type: String },
      buildingAddress: { type: String },
      landmark: { type: String }
    },
    profileImage: { type: String },
    profileImagePublicId: { type: String },
    isBlocked: { type: Boolean, default: false },

    uniqueId: { type: String, unique: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;  