const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phoneNumber: { type: String },
    address: { type: String },
    profileImage: { type: String }, // URL to the profile image
    isBlocked: { type: Boolean, default: false }, // New field for blocking admins

    uniqueId: { type: String, unique: true }, // Similar to your `Admin` schema
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
