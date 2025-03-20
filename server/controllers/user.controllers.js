const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const { generateTokenuser } = require("../lib/utils.js");
const TempUser = require("../model/tempuser.model.js");
const OTP = require("../model/otp.model.js");
const generateOTP = require("../lib/otpgenarator.js");
const sendEmail = require("../lib/nodemailer.js");
const jobTypes = require("../model/jobtypes.js");
const Contractor = require("../model/contractors.model.js");
const Intrests = require("../model/Intrests.model.js");
const cloudinary = require("../lib/cloudinary"); // Import Cloudinary config

// Multer setup for Cloudinary (already provided by you)
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file formats
    transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: Resize image
  },
});

const upload = multer({ storage });

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Email" });

    if (user.isBlocked) return res.status(403).json({ msg: "User is blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateTokenuser(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      uniqueId: user.uniqueId,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Register Controller
const register = async (req, res) => {
  const { email, password, name, uniqueId } = req.body;
  console.log(req.body);

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required man" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "user already exists" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const tempUser = new TempUser({
      name,
      email,
      password: hashPassword,
      uniqueId,
    });
    await tempUser.save();

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    await sendEmail(email, "Your OTP for Verification", `Your OTP is: ${otp}`);

    console.log(email, otp);

    res.status(200).json({ msg: "OTP sent to your email for verification" });
  } catch (error) {
    console.log("Error from register:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Verify OTP Controller
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Retrieve OTP and temporary user data
    const otpRecord = await OTP.findOne({ email });
    const tempUser = await TempUser.findOne({ email });

    if (!otpRecord || !tempUser) {
      return res.status(400).json({ msg: "OTP expired or not found" });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Save the user data to the database
    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      uniqueId: tempUser.uniqueId,
    });
    await newUser.save();

    // Clear temporary data
    await OTP.deleteOne({ email });
    await TempUser.deleteOne({ email });
    console.log("OTP deleted");

    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      uniqueId: newUser.uniqueId,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Fetch Job Types Controller
const fectchjobtypes = async (req, res) => {
  try {
    const data = await jobTypes.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching job types:", error);
    return null;
  }
};

// Fetch All Contractors Controller
const fectchallcontractors = async (req, res) => {
  try {
    const data = await Contractor.find({ verified: true });
    res.status(200).json(data);
  } catch (error) {
    console.error("fectchallcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Fetch Contractor by ID Controller
const fectchcontractors = async (req, res) => {
  const _id = req.params.id;
  console.log("in control", _id);

  try {
    const data = await Contractor.findOne({ _id });
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Add Interests Controller
const addintrests = async (req, res) => {
  const contractorId = req.params.id;
  const { phoneNumber, address, expectedDate, jobTypes } = req.body.formData;
  const {contractor} = req.body;
  const { _id, name, email } = req.user;
  console.log(_id);

  console.log("from addintrests",
    contractor
  );

  

  try {
    const newinterests = new Intrests({
      contractorId,
      userId: _id,
      phoneNumber,
      address,
      expectedDate,
      jobTypes,
      name,
      email,
      contractorName:contractor.contractorName,
      contractorEmail:contractor.email,
      companyName : contractor.companyName
      
    });
    await newinterests.save();
  
    const to = contractor.email;
    const subject = "New Interests Added";
    const msg = `Name:${name}\nPhone Number:${phoneNumber}\nAddress:${address}\nExpected Date:${expectedDate}\nJob Types:${jobTypes}`;

    sendEmail(to, subject, msg);
    res.status(200).json({ msg: "Interests sent to contractor" });
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Check User Controller
const cheak = async (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  try {
    const user = await User.findOne({ _id });
    res.status(200).json(user);
  } catch (error) {
    console.error("fectchcontractors error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Upload Profile Picture Controller
const uploadProfilePicture = async (req, res) => {
  try {
    const { _id } = req.user; // Get user ID from the authenticated request
    const file = req.file; // File uploaded by Multer

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    // Find the user
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Delete the previous image from Cloudinary if it exists
    if (user.profileImagePublicId) {
      await cloudinary.uploader.destroy(user.profileImagePublicId);
    }

    // Upload the new image to Cloudinary using the file buffer
    const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
      folder: "profile_pictures", // Folder in Cloudinary
      transformation: [{ width: 500, height: 500, crop: "limit" }], // Optional: Resize image
    });

    // Update the user's profile image and public ID
    user.profileImage = result.secure_url; // Cloudinary URL
    user.profileImagePublicId = result.public_id; // Cloudinary public ID
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

const Logoutuser = async (req, res) => {

  try {
    res.clearCookie("jwtuser");
    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    console.log("Error from logoutuser:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
}

// Export all controllers
module.exports = {
  login,
  register,
  verifyOTP,
  fectchjobtypes,
  fectchallcontractors,
  fectchcontractors,
  addintrests,
  cheak,
  uploadProfilePicture,
  Logoutuser
  // Add the new function here
};