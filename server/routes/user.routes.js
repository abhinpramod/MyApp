const express= require('express')
const router = express.Router();
const {register,login,verifyOTP, fectchjobtypes, fectchallcontractors, fectchcontractors}= require("../controllers/user.controllers");
const { protectRouteuser } = require("../middleware/authmiddleware");


router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.get ('/Jobtypes', fectchjobtypes);

router.get("/all-contractors",fectchallcontractors);

router.get("/contractor/:id",protectRouteuser, fectchcontractors);


module.exports = router;    