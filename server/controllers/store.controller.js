const Store = require("../model/store.model");
const Otp = require("../model/otp.model");
const sendEmail = require("../lib/nodemailer");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { generateTokenstore } = require("../lib/utils");
const Product = require("../model/products.model");

const {generateOTP} = require("../lib/otpgenarator");
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

    // const otpAge = (new Date() - otpRecord.createdAt) / 1000 / 60;
    // if (otpAge > 5) {
    //   await Otp.deleteOne({ email });
    //   return res.status(400).send("OTP expired");
    // }

    await Otp.deleteOne({ email });
    res.status(200).send("OTP verified");
  } catch (error) {
    res.status(500).send("OTP verification failed");
  }
};

const registerStore = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debug: Log request body
    console.log("Request Files:", req.files); // Debug: Log request files

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
      console.log("GST File:", gstFile); // Debug: Log GST file details
      const result = await cloudinary.uploader.upload(
        `data:${gstFile.mimetype};base64,${gstFile.buffer.toString("base64")}`,
        { folder: "store_docs" }
      );
      gstDocUrl = result.secure_url;
    }

    // Upload Store License to Cloudinary
    if (req.files["storeLicense"] && req.files["storeLicense"][0]) {
      const licenseFile = req.files["storeLicense"][0];
      console.log("License File:", licenseFile); // Debug: Log license file details
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
      // storeId: uuidv4(),
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
        .json({ msg: "Your store registration is awaiting admin approval  " });
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
  console.log("checkAuth middleware triggered");
  try {
    console.log("controll", req.store);
    res.status(200).json(req.store);
    console.log(req.store);
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};

const getStoreProfile = async (req, res) => {
  try {
    const store = await Store.findById(req.store._id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    console.error('Error fetching store profile:', error);
    res.status(500).json({ error: 'Failed to fetch store profile' });
  }
};

// Get store by ID (public)
const getStoreById = async (req, res) => {
  console.log(req.params.storeId,'storeid');
  try {
    const store = await Store.findById(req.params.storeId);
    console.log(store);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    console.error('Error fetching store from getStoreById:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
};

// Update store profile picture
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'store-profiles' }
    );

    // Update store
    const store = await Store.findByIdAndUpdate(
      req.store._id,
      { profilePicture: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile picture updated successfully',
      imageUrl: result.secure_url
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
};

// Get store's products (owner view)
const getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.store._id });
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching store products:', error);
    res.status(500).json({ error: 'Failed to fetch store products' });
  }
};

// Get store's products (public view)
const getPublicStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ storeId: req.params.storeId });
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching store products:', error);
    res.status(500).json({ error: 'Failed to fetch store products' });
  }
};

module.exports = { sendOtp, verifyOtp, registerStore, login, checkstore, getStoreProfile, getStoreById, getStoreProducts, getPublicStoreProducts, updateProfilePicture };
