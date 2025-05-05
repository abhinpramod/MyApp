const Contractor = require("../../model/contractors.model.js");
const cloudinary = require("../../lib/cloudinary");

const contractorprofile = async (req, res) => {
  try {
    const contractor = await Contractor.findById(req.contractor._id)
      .select("-password -__v");
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

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    // Delete old profile picture if exists
    if (contractor.profilePicturePublicId) {
      await cloudinary.uploader.destroy(contractor.profilePicturePublicId);
    }

    // Upload new profile picture
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_pictures",
        resource_type: "image",
      }
    );

    // Update contractor
    contractor.profilePicture = result.secure_url;
    contractor.profilePicturePublicId = result.public_id;
    await contractor.save();

    res.status(200).json({ 
      message: "Profile picture updated successfully",
      profilePicture: result.secure_url 
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    res.status(500).json({ message: "Failed to upload profile picture", error });
  }
};

module.exports = {
  contractorprofile,
  uploadProfilePic,
};