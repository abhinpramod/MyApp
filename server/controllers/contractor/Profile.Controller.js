// controllers/profileController.js
const Contractor = require("../../model/contractors.model.js");
const cloudinary = require("../../lib/cloudinary");

const contractorprofile = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.contractor._id);
    if (!contractor) {
      return res.status(404).json({ msg: "Contractor not found" });
    }
    res.status(200).json(contractor);
  } catch (error) {
    console.log("Error from contractorprofile:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const uploadProfilePic = async (req, res) => {
  try {
    const contractorId = req.contractor._id;
    console.log("Contractor ID:", contractorId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Fetch contractor data
    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Delete old profile picture from Cloudinary if it exists
    if (contractor.profilePicturePublicId) {
      console.log(
        "Old profile picture public ID:",
        contractor.profilePicturePublicId
      );
      await cloudinary.uploader.destroy(contractor.profilePicturePublicId);
      console.log("Old profile picture deleted from Cloudinary");
    }

    // Upload new profile picture to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_pictures",
        resource_type: "image",
      }
    );

    console.log("Profile picture uploaded:", result);

    // Update contractor profile picture fields **without triggering full validation**
    await Contractor.findByIdAndUpdate(
      contractorId,
      {
        profilePicture: result.secure_url,
        profilePicturePublicId: result.public_id,
      },
      { new: true, runValidators: false } // Disable full validation to prevent the `projects.id` issue
    );

    res
      .status(200)
      .json({ message: "Profile picture updated successfully", contractor });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res
      .status(500)
      .json({ message: "Failed to upload profile picture", error });
  }
};

module.exports = {
  contractorprofile,
  uploadProfilePic,
};