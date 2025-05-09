const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/order.controller');
const {protectRouteuser} = require('../middleware/authmiddleware'); // Your auth middleware

// Create new order
router.post('/create', protectRouteuser,createOrder);

module.exports = router;