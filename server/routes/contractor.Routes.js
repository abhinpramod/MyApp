const express = require("express");
const router = express.Router();
const {
  registerstep1,
  login,
  verifyOTP,
  registerstep2,
  upload,
  checkAuth,
  contractorprofile,
  updateAvailability
} = require("../controllers/contractor.controllers");
const { protectRoutecontractor } = require("../middleware/authmiddleware"); // Use correct import

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


module.exports = router;
