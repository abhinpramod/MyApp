const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  fectchjobtypes,
  fectchallcontractors,
  fectchcontractors,
  addintrests,
  cheak,
  uploadProfilePicture,
  Logoutuser
  // Import the new function
} = require("../controllers/user.controllers");
const { protectRouteuser } = require("../middleware/authmiddleware");
const upload = require("../middleware/Multermiddleware"); // Import Multer middleware

// Existing routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.get("/Jobtypes", fectchjobtypes);
router.get("/all-contractors", fectchallcontractors);
router.get("/contractor/:id", protectRouteuser, fectchcontractors);
router.post("/contractor/interest/:id", protectRouteuser, addintrests);
router.get("/check", protectRouteuser, cheak);
router.post("/logout", Logoutuser);

// New route for uploading profile picture
router.put("/uploadprofile", protectRouteuser, upload.single("profilePicture"), uploadProfilePicture);

module.exports = router;