const Store = require("../model/store.model");
const Otp = require("../model/otp.model");
const sendEmail = require("../lib/nodemailer");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { generateTokenstore } = require("../lib/utils");

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
      approved: false,
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

    generateTokenstore(store._id, res);

    res.status(200).json({ msg: "Login successful" });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const checkstore = (req, res) => {
  try {
    console.log("controll", req.contractor);
    res.status(200).json(req.contractor);
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { sendOtp, verifyOtp, registerStore, login, checkstore };
