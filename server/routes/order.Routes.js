const express = require('express');
const router = express.Router();
const { createOrder,getOrders } = require('../controllers/order.controller');
const {protectRouteuser, protectRoutestore} = require('../middleware/authmiddleware'); // Your auth middleware

// Create new order
router.post('/create', protectRouteuser,createOrder);
router.get('/', protectRoutestore,getOrders);

module.exports = router;