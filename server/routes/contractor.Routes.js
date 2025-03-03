const express= require('express')
const router = express.Router();
const {registerstep1,login,verifyOTP,registerstep2,upload}= require("../controllers/contractor.controllers");
// const { protectRoute } = require("../middleware/authmiddleware");


router.post("/register1ststep", registerstep1);
router.post("/register2ndstep",upload.fields([{ name: "gstDoc", maxCount: 1 }, { name: "licenseDoc", maxCount: 1 }]), registerstep2);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// router.post("/ContractorProfile",ContractorProfile)

module.exports = router;  