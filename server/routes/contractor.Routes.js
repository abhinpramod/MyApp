const express= require('express')
const router = express.Router();
const {register,login,verifyOTP,ContractorProfile}= require("../controllers/contractor.controllers");
// const { protectRoute } = require("../middleware/authmiddleware");


router.post("/register1ststep", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
// router.post("/ContractorProfile",ContractorProfile)

module.exports = router;  