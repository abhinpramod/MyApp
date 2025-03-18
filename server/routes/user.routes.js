const express= require('express')
const router = express.Router();
const {register,login,verifyOTP, fectchjobtypes, fectchallcontractors}= require("../controllers/user.controllers");


router.post("/register", register);

router.post("/login", login);

router.post("/verify-otp", verifyOTP);

router.get ('/Jobtypes', fectchjobtypes);

router.get("/all-contractors",fectchallcontractors);


module.exports = router;    