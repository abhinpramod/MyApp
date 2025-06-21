const Store = require("../model/store.model");
const Otp = require("../model/otp.model");
const sendEmail = require("../lib/nodemailer");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { generateTokenstore } = require("../lib/utils");
const Product = require("../model/products.model");
const { generateOTP } = require("../lib/otpgenarator");

// Send OTP
const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otpCode = generateOTP();
  console.log(otpCode);
  try {
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) await Otp.deleteOne({ email });

    await Otp.create({ email, otp: otpCode, createdAt: new Date() });
    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP is: ${otpCode}. This OTP is valid for 5 minutes.`
    );
    res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to send OTP");
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) return res.status(400).send("Invalid OTP");

    await Otp.deleteOne({ email });
    res.status(200).send("OTP verified");
  } catch (error) {
    res.status(500).send("OTP verification failed");
  }
};

const registerStore = async (req, res) => {
  try {
    if (!req.files || !req.files.gstDocument || !req.files.storeLicense) {
      return res
        .status(400)
        .send("GST Document and Store License are required");
    }

    const {
      storeName,
      ownerName,
      country,
      state,
      city,
      address,
      email,
      phone,
      storeType,
      gstNumber,
      password,
    } = req.body;

    let gstDocUrl = "";
    let licenseDocUrl = "";

    // Upload GST Document to Cloudinary
    if (req.files["gstDocument"] && req.files["gstDocument"][0]) {
      const gstFile = req.files["gstDocument"][0];
      const result = await cloudinary.uploader.upload(
        `data:${gstFile.mimetype};base64,${gstFile.buffer.toString("base64")}`,
        { folder: "store_docs" }
      );
      gstDocUrl = result.secure_url;
    }

    // Upload Store License to Cloudinary
    if (req.files["storeLicense"] && req.files["storeLicense"][0]) {
      const licenseFile = req.files["storeLicense"][0];
      const result = await cloudinary.uploader.upload(
        `data:${licenseFile.mimetype};base64,${licenseFile.buffer.toString(
          "base64"
        )}`,
        { folder: "store_docs" }
      );
      licenseDocUrl = result.secure_url;
    }

    // Check if store already exists
    const existingStore = await Store.findOne({ email });
    if (existingStore)
      return res.status(400).send("Store already registered with this email");

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new store
    const newStore = new Store({
      storeName,
      ownerName,
      country,
      state,
      city,
      address,
      email,
      phone,
      storeType,
      gstNumber,
      gstDocument: gstDocUrl,
      storeLicense: licenseDocUrl,
      approvelstatus: "Pending",
      blocked: false,
      password: hashPassword,
    });

    await newStore.save();
    await sendEmail(
      email,
      "Registration Successful",
      "Your store registration is awaiting admin approval."
    );
    res.status(200).send("Store registered successfully");
  } catch (error) {
    console.error("Error registering store:", error);
    res.status(500).send("Failed to register store");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const store = await Store.findOne({ email });
    if (!store) {
      return res.status(400).json({ msg: "Store not registered" });
    }

    const isMatch = await bcrypt.compare(password, store.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    if (store.approvelstatus === "Pending") {
      return res
        .status(403)
        .json({ msg: "Your store registration is awaiting admin approval" });
    }

    if (store.approvelstatus === "Rejected") {
      return res
        .status(403)
        .json({ msg: "Your store registration is rejected" });
    }

    if (store.isBlocked) {
      return res.status(403).json({ msg: "your account is blocked" });
    }

    generateTokenstore(store._id, res);

    res.status(200).json({ msg: "Login successful" });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const checkstore = (req, res) => {
  try {
    res.status(200).json(req.store);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getStoreProfile = async (req, res) => {
  try {
    const store = await Store.findById(req.store._id);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    console.error("Error fetching store profile:", error);
    res.status(500).json({ error: "Failed to fetch store profile" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    console.error("Error fetching store from getStoreById:", error);
    res.status(500).json({ error: "Failed to fetch store" });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const store = await Store.findById(req.store._id);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    // Delete old image from Cloudinary if it exists
    if (store.profilePicture) {
      try {
        const publicId = store.profilePicture.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`store_profile_pictures/${publicId}`);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
    }

    const dataUri = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "store_profile_pictures",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto:good" },
      ],
    });

    store.profilePicture = result.secure_url;
    await store.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile picture",
    });
  }
};

const updateDescription = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
    }

    if (description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 1000 characters",
      });
    }

    const store = await Store.findByIdAndUpdate(
      req.store._id,
      { description: description.trim() },
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Description updated successfully",
      description: store.description,
    });
  } catch (error) {
    console.error("Error updating description:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update description",
    });
  }
};

const getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.store._id });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({ error: "Failed to fetch store products" });
  }
};

const getPublicStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.params.storeId });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching store products:", error);
    res.status(500).json({ error: "Failed to fetch store products" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Failed to log out" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const store = await Store.findOne({ email });

    if (!store) {
      return res.status(404).json({ msg: "store not found" });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    console.log(otp , "otp");

    // Save OTP to database
    await Otp.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new Otp({ email, otp });
    await otpRecord.save();

    // Send OTP via email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const store = await Store.findOne({ email });

    if (!store) {
      return res.status(404).json({ msg: "Contractor not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    store.password = hashedPassword;

    await store.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const verifyOTPforget = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const store = await Otp.findOne({ email, otp });

    if (!store) {
      return res.status(400).json({ msg: "Invalid OTP d" });
    }

    res.json({ msg: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  registerStore,
  login,
  checkstore,
  getStoreProfile,
  getStoreById,
  getStoreProducts,
  getPublicStoreProducts,
  updateProfilePicture,
  updateDescription,
  logout,
  forgotPassword,
  resetPassword,
  verifyOTPforget,
};
