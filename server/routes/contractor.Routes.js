const express = require("express");
const router = express.Router();
const {
  login,
  registerstep1,
  verifyOTP,
  logoutcontractor,
  checkAuth
} = require("../controllers/contractor/Auth.Controller.js"); // Import the authControllerauthController");
const { contractorprofile, uploadProfilePic } = require("../controllers/contractor/Profile.Controller");
const { addProject, handleDeleteProject } = require("../controllers/contractor/Project.Controller");
const { registerstep2 } = require("../controllers/contractor/Registration.Controller");
const {
  fectchjobtypes,
  fectchintrestes,
  markseen,
} = require("../controllers/contractor/Utility.Controller");
const {
  updateAvailability,
  updateemployeesnumber,
} = require("../controllers/contractor/Settings.Controller");
const { protectRoutecontractor } = require("../middleware/authmiddleware");
const  upload  = require("../middleware/Multermiddleware");

// Auth Routes
router.post("/register1ststep", registerstep1); // Step 1 of registration
router.post(
  "/register2ndstep",
  upload.fields([
    { name: "gstDocument", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 },
  ]),protectRoutecontractor,
  registerstep2
); // Step 2 of registration
router.post("/verify-otp", verifyOTP); // OTP verification
router.post("/login", login); // Login
router.post("/logout", logoutcontractor); // Logout

// Profile Routes
router.get("/profile", protectRoutecontractor, contractorprofile); // Get contractor profile
router.put(
  "/updateProfilePic",
  protectRoutecontractor,
  upload.single("profilePic"),
  uploadProfilePic
); // Update profile picture

// Project Routes
router.post(
  "/addprojects",
  protectRoutecontractor,
  upload.single("image"),
  addProject
); // Add a new project
router.delete("/deleteproject", protectRoutecontractor, handleDeleteProject); // Delete a project

// Utility Routes
router.get("/jobtypes", fectchjobtypes); // Fetch job types
router.get("/all-interests", protectRoutecontractor, fectchintrestes); // Fetch interests
router.patch("/mark-interest-seen/:id", markseen); // Mark interest as seen

// Settings Routes
router.put("/availability", protectRoutecontractor, updateAvailability); // Update availability
router.put("/employeesnumber", protectRoutecontractor, updateemployeesnumber); // Update number of employees

// Auth Middleware Route
router.get("/check", protectRoutecontractor, checkAuth); // Check authentication status

module.exports = router;