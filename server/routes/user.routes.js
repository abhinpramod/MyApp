const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  logout,
  fetchJobTypes,
  fetchAllContractors,
  fetchContractorById,
  addInterests,
  checkUser,
  uploadProfilePicture,
  fetchAllInterests,
  updateShippingInfo,
  forgotPassword,
  verifyOTPforget,
  resetPassword
} = require("../controllers/user/index.js");
const { protectRouteuser } = require("../middleware/authmiddleware.js");
const {upload }= require("../middleware/Multermiddleware.js");

// ==================== Authentication Routes ====================
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/logout", logout);
 router.post ("/forgot-password", forgotPassword); 
 router.post ("/verify-otpforget", verifyOTPforget);
 router.post ("/reset-password", resetPassword);
// ==================== User Profile Routes ====================
router.get("/check", protectRouteuser, checkUser);
router.put(
  "/uploadprofile", 
  protectRouteuser, 
  upload.single("profilePicture"), 
  uploadProfilePicture
);

// ==================== Job/Contractor Routes ====================
router.get("/Jobtypes", fetchJobTypes);
router.get("/contractors",fetchAllContractors);
router.get("/contractors/:id", fetchContractorById);
router.post("/contractor/interest/:id", protectRouteuser, addInterests);
router.get("/all-interests", protectRouteuser, fetchAllInterests);

router.put('/update-shipping', protectRouteuser, updateShippingInfo);

module.exports = router;