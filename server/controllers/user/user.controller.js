// user.controller.js
const User = require("../../model/user.model.js");
const cloudinary = require("../../lib/cloudinary");

// Check User Controller
const checkUser = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  try {
    const user = await User.findOne({ _id });
    res.status(200).json(user);
  } catch (error) {
    console.error("User check error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Upload Profile Picture Controller
const uploadProfilePicture = async (req, res) => {
  try {
    const { _id } = req.user;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
      folder: "profile_pictures",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    user.profileImage = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();

    res.status(200).json({
      msg: "Profile picture uploaded successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ msg: "Failed to upload profile picture" });
  }
};

module.exports = {
  checkUser,
  uploadProfilePicture
};