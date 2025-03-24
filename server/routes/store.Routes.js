const express = require('express');
const router = express.Router();
const {  sendOtp, verifyOtp, registerStore, login } = require('../controllers/store.controller');
const upload = require('../middleware/Multermiddleware');

router.post("/send-otp", sendOtp);
router.post("/verify-otp",  verifyOtp);
// router.post('/register', registerStore);
 // Adjust path as needed

 router.post('/register', upload.fields([
    { name: 'gstDocument', maxCount: 1 },
    { name: 'storeLicense', maxCount: 1 },
  ]), registerStore);

  router.post("/login", login);
module.exports = router;