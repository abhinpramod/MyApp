const Contractor = require("../model/contractors.model.js");
const TempContractor = require("../model/tempcontractor.model.js");
const OTP = require("../model/otp.model.js");
const bcrypt = require("bcrypt");
const generateToken = require("../lib/utils.js");
const generateOTP = require("../lib/otpgenarator");
const sendEmail = require("../lib/nodemailer");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const contractor = await Contractor.findOne({ email });
    if (!contractor) return res.status(400).json({ msg: "Invalid Email" });

    if (contractor.isBlocked)
      return res.status(403).json({ msg: "Contractor is blocked" });

    const isMatch = await bcrypt.compare(password, contractor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateToken(contractor._id, res);
    res.status(200).json({
      _id: contractor._id,
      contractorName: contractor.contractorName,
      email: contractor.email,
      companyName: contractor.companyName,
      location: contractor.location,
      phone: contractor.phone,
      jobTypes: contractor.jobTypes,
      numberOfEmployees: contractor.numberOfEmployees,
      profilePicture: contractor.profilePicture,
      gstNumber: contractor.gstNumber,
      gstDocument: contractor.gstDocument,
      licenseDocument: contractor.licenseDocument,
      registrationStep: contractor.registrationStep,
      verified: contractor.verified,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const register = async (req, res) => {
  const {
    email,
    password,
    contractorName,
    companyName,
    location,
    phone,
    jobTypes,
    numberOfEmployees,
  } = req.body;
  console.log(req.body);

  try {
    if (
      !contractorName ||
      !email ||
      !password ||
      !companyName ||
      !location ||
      !phone ||
      !jobTypes ||
      !numberOfEmployees
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Save temporary contractor data
    const tempContractor = new TempContractor({
      contractorName,
      email,
      password: hashPassword,
      companyName,
      location,
      phone,
      jobTypes,
      numberOfEmployees,
    });
    await tempContractor.save();

    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    // Send OTP to email
    console.log(email, "Your OTP for Verification", `Your OTP is: ${otp}`);

    await sendEmail(
      "abhinabhi310@gmail.com",
      "Your OTP for Verification",
      `Your OTP is: ${otp}`
    );

    res.status(200).json({ msg: "OTP sent to your email for verification" });
  } catch (error) {
    console.log("Error from register:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Retrieve OTP and temporary contractor data
    const otpRecord = await OTP.findOne({ email });
    const tempContractor = await TempContractor.findOne({ email });
console.log(otpRecord, tempContractor);
    if (!otpRecord || !tempContractor) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    // Compare OTPs
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Save the contractor data to the database
    const newContractor = new Contractor(tempContractor);
    await newContractor.save();
    console.log("New contractor saved:", newContractor);

    // Clear temporary data
    await OTP.deleteOne({ email });
    await TempContractor.deleteOne({ email });
    console.log("Temporary data deleted for email:", email);

    res.status(200).json({
      _id: newContractor._id,
      contractorName: newContractor.contractorName,
      email: newContractor.email,
      companyName: newContractor.companyName,
      location: newContractor.location,
      phone: newContractor.phone,
      jobTypes: newContractor.jobTypes,
      numberOfEmployees: newContractor.numberOfEmployees,
      message: "Contractor registered successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = { login, register, verifyOTP };
