const express = require("express");
const router = express.Router();
const {
  login,
  registerstep1,
  verifyOTP,
  logoutcontractor,
  checkAuth,
  forgotPassword,
  verifyOTPforget,
  resetPassword
} = require("../controllers/contractor/Auth.Controller.js");
const { contractorprofile, uploadProfilePic } = require("../controllers/contractor/Profile.Controller.js");
const { 
  addProject, 
  deleteProject,
  getProjects,
  uploadProjectMedia 
} = require("../controllers/contractor/Project.Controller.js");
const { registerstep2 } = require("../controllers/contractor/Registration.Controller.js");
const {
  fectchjobtypes,
  fectchintrestes,
  markseen,
  numberofnotification
} = require("../controllers/contractor/Utility.Controller.js");
const {
  updateAvailability,
  updateemployeesnumber,
  updateDescription
} = require("../controllers/contractor/Settings.Controller.js");
const { protectRoutecontractor } = require("../middleware/authmiddleware.js");
const { upload, handleMulterErrors } = require("../middleware/Multermiddleware.js");

// Auth Routes
router.post("/register1ststep", registerstep1);
router.post(
  "/register2ndstep",
  upload.fields([
    { name: "gstDocument", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 },
  ]),
  protectRoutecontractor,
  registerstep2
);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/logout", logoutcontractor);
router.post ("/forgot-password", forgotPassword); 
router.post ("/verify-otpforget", verifyOTPforget);
router.post ("/reset-password", resetPassword);
// Profile Routes
router.get("/profile", protectRoutecontractor, contractorprofile);
router.put(
  "/update-profile-pic",
  protectRoutecontractor,
  upload.single("profilePic"),
  uploadProfilePic
);

// Project Routes (Updated)
router.post(
  "/upload-media",
  protectRoutecontractor,
  upload.array("media", 3),
  handleMulterErrors, // Add this middleware
  uploadProjectMedia
);
router.post(
  "/projects",
  protectRoutecontractor,
  addProject
);
router.get(
  "/projects",
  protectRoutecontractor,
  getProjects
);
router.delete(
  "/projects/:id",
  protectRoutecontractor,
  deleteProject
);

// Utility Routes
router.get("/jobtypes", fectchjobtypes);
router.get("/all-interests", protectRoutecontractor, fectchintrestes);
router.patch("/mark-interest-seen/:id", markseen);
router.get("/notifications",protectRoutecontractor,numberofnotification );

// Settings Routes
router.put("/update-availability", protectRoutecontractor, updateAvailability);
router.put("/update-employees", protectRoutecontractor, updateemployeesnumber);
router.put("/update-description", protectRoutecontractor, updateDescription);


// Auth Middleware Route
router.get("/check", protectRoutecontractor, checkAuth);

module.exports = router;