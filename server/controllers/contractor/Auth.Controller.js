// controllers/authController.js
const bcrypt = require("bcrypt");
const { generateTokencontractor } = require("../../lib/utils.js");
const Contractor = require("../../model/contractors.model.js");
const OTP = require("../../model/otp.model.js");
const { generateOTP } = require("../../lib/otpgenarator");
const  sendEmail  = require("../../lib/nodemailer");
const cloudinary = require("../../lib/cloudinary");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const contractor = await Contractor.findOne({ email });
    if (!contractor) return res.status(400).json({ msg: "Invalid Email" });

    if (contractor.isBlocked)
      return res
        .status(403)
        .json({ msg: "your account  is blocked connect with admin." });

    const isMatch = await bcrypt.compare(password, contractor.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateTokencontractor(contractor._id, res);
    res.status(200).json(contractor);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const registerstep1 = async (req, res) => {
 
  const {
    email,
    password,
    contractorName,
    companyName,
    country,
    state,
    city,
    phone,
    jobTypes,
    numberOfEmployees,
  } = req.body;

  try {
    if (
      !contractorName ||
      !email ||
      !password ||
      !companyName ||
      !country ||
      !state ||
      !city ||
      !phone ||
      !jobTypes ||
      !numberOfEmployees
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const existingContractor = await Contractor.findOne({ email });
    if (existingContractor) {
      return res.status(400).json({ msg: "Email already exists" });
    }

   

    // Generate and save OTP
    const otp = generateOTP();
    console.log(otp)
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    // Send OTP to email

    await sendEmail(email, "Your OTP for Verification", `Your OTP is: ${otp}`);

    res.status(200).json({ msg: "OTP sent to your email for verification" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const verifyOTP = async (req, res) => {
    const { email, otp, password, contractorName, companyName, country, state, city, phone, jobTypes, numberOfEmployees } = req.body;
  
    try {
      // Validate input
      if (!email || !otp || !password) {
        return res.status(400).json({ message: "Email, OTP, and password are required" });
      }
  
      // Retrieve OTP and temporary contractor data
      const otpRecord = await OTP.findOne({ email,otp });
  
      // Check if OTP record exists
      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
      }
  

  
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
  
      // Save contractor data
      const contractor = new Contractor({
        contractorName,
        email,
        password: hashPassword,
        companyName,
        country,
        state,
        city,
        phone,
        jobTypes,
        numberOfEmployees,
      });
      await contractor.save();
  
  
      // Clear temporary data
      await OTP.deleteOne({ email });
  
      res.status(200).json({
        message: "Contractor registered successfully, wait for admin approval",
        contractor,
      });
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
 

const logoutcontractor = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// controllers/authMiddleware.js
const checkAuth = (req, res) => {
    try {
      res.status(200).json(req.contractor);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };


  // controllers/registrationController.js
 
  
  const registerstep2 = async (req, res) => {
  
    try {
      const { id } = req.params;
      const { gstNumber } = req.body;
  
      // Check if the contractor exists
      const contractor = await Contractor.findById(id);
      if (!contractor) {
        return res.status(404).json({ message: "Contractor not found" });
      }
  
      // Upload files to Cloudinary
      let gstDocUrl = "";
      let licenseDocUrl = "";
  
      if (req.files && req.files["gstDocument"] && req.files["gstDocument"][0]) {
        const result = await cloudinary.uploader.upload(
          `data:${req.files["gstDocument"][0].mimetype};base64,${req.files[
            "gstDocument"
          ][0].buffer.toString("base64")}`,
          {
            folder: "contractor_docs",
          }
        );
        gstDocUrl = result.secure_url;
      }
  
      if (
        req.files &&
        req.files["licenseDocument"] &&
        req.files["licenseDocument"][0]
      ) {
        const result = await cloudinary.uploader.upload(
          `data:${req.files["licenseDocument"][0].mimetype};base64,${req.files[
            "licenseDocument"
          ][0].buffer.toString("base64")}`,
          {
            folder: "contractor_docs",
          }
        );
        licenseDocUrl = result.secure_url;
      }
  
      // Update contractor details in MongoDB
      contractor.gstNumber = gstNumber;
      contractor.gstDocument = gstDocUrl;
      contractor.licenseDocument = licenseDocUrl;
      contractor.registrationStep = 2;
      contractor.approvalStatus = "Pending";
      contractor.verified = false; // Mark as pending verification
  
      await contractor.save();
  
      res
        .status(200)
        .json({ message: "Step 2 registration completed", contractor });
    } catch (error) {
      console.error("error from registerstep2", error);
      res.status(500).json({ message: "Server error", error });
    }
  };
  

  


module.exports = {
  login,
  registerstep1,
  verifyOTP,
  logoutcontractor,
  checkAuth,
  registerstep2
};