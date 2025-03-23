const express = require('express');
const router = express.Router();
const {  sendOtp, verifyOtp, registerStore } = require('../controllers/store.controller');
const upload = require('../middleware/Multermiddleware');

router.post("/send-otp", sendOtp);
router.post("/verify-otp",  verifyOtp);
// router.post('/register', registerStore);
 // Adjust path as needed

 router.post('/register', upload.fields([
    { name: 'gstDocument', maxCount: 1 },
    { name: 'storeLicense', maxCount: 1 },
  ]), (req, res, next) => {
    console.log("Multer middleware triggered!"); // Log when Multer middleware is triggered
    console.log("Request Body:", req.body); // Log request body
    console.log("Request Files:", req.files); // Log request files
    next(); // Pass control to the next middleware/controller
  }, registerStore);
module.exports = router;