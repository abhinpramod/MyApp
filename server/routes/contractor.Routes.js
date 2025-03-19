const express = require("express");
const router = express.Router();
const {
  login,
  registerstep1,
  verifyOTP,
  registerstep2,
  upload,
  checkAuth,
  contractorprofile,
  updateAvailability,
  updateemployeesnumber,
  uploadProfilePic,
  addProject,
  uploadForProjects,
  handleDeleteProject,
  logoutcontractor ,
  fectchjobtypes,
  fectchintrestes,
  markseen

} = require("../controllers/contractor.controllers");
const { protectRoutecontractor } = require("../middleware/authmiddleware");

// Existing routes
router.post("/register1ststep", registerstep1);
router.post(
  "/register2ndstep:id",
  upload.fields([
    { name: "gstDocument", maxCount: 1 },
    { name: "licenseDocument", maxCount: 1 },
  ]),
  registerstep2
);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/check", protectRoutecontractor, checkAuth);
router.get("/profile", protectRoutecontractor, contractorprofile);
router.put("/availability", protectRoutecontractor, updateAvailability);
router.put("/employeesnumber", protectRoutecontractor, updateemployeesnumber);
router.put(
  "/updateProfilePic",
  upload.single("profilePic"),
  protectRoutecontractor,
  uploadProfilePic
);

// Updated route for addProject
router.post(
  "/addprojects",
  protectRoutecontractor,
  uploadForProjects.single("image"), // Use the new Multer instance
  addProject
);
router.delete("/deleteproject", protectRoutecontractor, handleDeleteProject);
router.post("/logout",logoutcontractor);
router.get('/jobtypes', fectchjobtypes);
router.get("/all-interests", protectRoutecontractor,fectchintrestes);

router.patch("/mark-interest-seen/:id", markseen);

module.exports = router;