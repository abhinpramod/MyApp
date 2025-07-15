// auth.controller.js
const User = require("../../model/user.model.js");
const bcrypt = require("bcryptjs");
const { generateTokenuser } = require("../../lib/utils.js");
const OTP = require("../../model/otp.model.js");
const{ generateOTP }= require("../../lib/otpgenarator.js");
const sendEmail = require("../../lib/nodemailer.js");
const env = require("dotenv");  
env.config();

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Email" });

    if (user.isBlocked)
      return res
        .status(403)
        .json({ msg: "your account  is blocked connect with admin." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    generateTokenuser(user._id, res);
    const userData = user.toObject();
    delete userData.password;

    res.status(200).json(userData);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Register Controller
const register = async (req, res) => {
  const { email, password, name, uniqueId,phone } = req.body;

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

   


    // Generate and save OTP
    const otp = generateOTP();
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    await sendEmail(email, "Your OTP for Verification", `Your OTP is: ${otp}`);


    res.status(200).json({ msg: "OTP sent to your email for verification" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Verify OTP Controller
const verifyOTP = async (req, res) => {
  const { email, otp, password, uniqueId, phone,name } = req.body;

  try {
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    // Retrieve OTP and temporary user data
    const otpRecord = await OTP.findOne({ email, otp });
    // const    = await   .findOne({ email });

    if (!otpRecord   ) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }
    

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Save the user data to the database
    const newUser = new User({
        name,
       email,
        password:hashPassword,
         uniqueId,
         phoneNumber:phone
    });
    await newUser.save();

    // Clear temporary data
    await OTP.deleteOne({ email });
    const userdata=newUser.toObject();
    delete userdata.password;
    res.status(200).json({msg:"Registration successful",user:userdata});


  } catch (error) {
    console.error("Error verifying OTP:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV  !== "development",  // true in production
      sameSite: "none",
      path: "/",  // IMPORTANT: should match cookie path when it was set
    });

    res.status(200).json({ msg: "Logout successful" });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
};


const  forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Generate 6-digit OTP
const otp = generateOTP();
console.log(otp)

    // Save OTP to database
    await OTP.deleteOne({ email }); // Delete existing OTP
    const otpRecord = new OTP({ email, otp });
    await otpRecord.save();

    // Send OTP via email
    await sendEmail(email, "Password Reset OTP", `Your OTP is: ${otp}`);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}


  const resetPassword= async (req, res) => {
  try {
    const { email,  newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ msg: "Contractor not found" });
    }

 

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}


  const verifyOTPforget = async (req, res) => {
 try {
    const { email, otp } = req.body;
    const user = await OTP.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ msg: "Invalid OTP d" });
    }

    res.json({ msg: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = {
  login,
  register,
  verifyOTP,
  logout,
  forgotPassword,
  verifyOTPforget,
  resetPassword
};