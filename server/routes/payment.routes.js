// routes/paymentRoutes.js
const express = require('express');
const { createCheckoutSession, verifyPayment } = require('../controllers/payment.controller');
const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/verify', verifyPayment);

module.exports = router;
