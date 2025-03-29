const express = require('express');
const router = express.Router();
const {  sendOtp, verifyOtp, registerStore, login,checkstore, getStoreProfile, getStoreById, getStoreProducts, getPublicStoreProducts, updateProfilePicture  } = require('../controllers/store.controller');
const upload = require('../middleware/Multermiddleware');
const {protectRoutestore}= require('../middleware/authmiddleware');

router.post("/send-otp", sendOtp);
router.post("/verify-otp",  verifyOtp);
// router.post('/register', registerStore);
 // Adjust path as needed

 router.post('/register', upload.fields([
    { name: 'gstDocument', maxCount: 1 },
    { name: 'storeLicense', maxCount: 1 },
  ]), registerStore);
  router.get('/profile', protectRoutestore, getStoreProfile);
router.put(
  '/profile/image', 
  protectRoutestore, 
  upload.single('image'),
  updateProfilePicture
);

// Public store routes
router.get('/store/:storeId', getStoreById);
router.get('/:storeId/products', getPublicStoreProducts);

// Store products (owner view)
router.get('/products', protectRoutestore, getStoreProducts);

  router.post("/login", login);
  router.get("/check",protectRoutestore, checkstore);
  
module.exports = router;