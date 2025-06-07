const express = require('express');
const router = express.Router();
const {  sendOtp, verifyOtp, registerStore, login,checkstore, getStoreProfile,logout, getStoreById, getStoreProducts, getPublicStoreProducts, updateProfilePicture,updateDescription  } = require('../controllers/store.controller');
const {upload} = require('../middleware/Multermiddleware');
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

router.get('/products', protectRoutestore, getStoreProducts);

  router.post("/login", login);
  router.get("/check",protectRoutestore, checkstore);
  
  router.put(
    '/profile/image',
  
    protectRoutestore,
  
    upload.single('image'), // 'image' should match the field name in your frontend
  updateProfilePicture
  );
  
  // Update description
  router.put(
    '/profile/description',
  
    protectRoutestore,
  
    updateDescription
  );

  router.post("/logout",logout);

  
module.exports = router;