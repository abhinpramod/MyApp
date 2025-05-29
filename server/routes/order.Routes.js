const express = require('express');
const router = express.Router();
const { 
  createOrder,
  getOrders,
  updateTransportationCharge,
  rejectOrder,
  getnotifications,getOrdersforconfirmation,rejectOrderByCustomer,confirmOrder
} = require('../controllers/order.controller');
const { protectRouteuser, protectRoutestore } = require('../middleware/authmiddleware');

// Create new order
router.post('/create', protectRouteuser, createOrder);

// Get orders with filtering
router.get('/', protectRoutestore, getOrders);

// Update transportation charge
router.patch('/:orderId/transportation', protectRoutestore, updateTransportationCharge);

// Reject order
router.patch('/:orderId/reject', protectRoutestore, rejectOrder);

router.get('/notifications', protectRoutestore,getnotifications );

router.get ('/pending-confirmation',protectRouteuser, getOrdersforconfirmation);

router.post('/confirm',protectRouteuser, confirmOrder);



router.patch(
  '/:orderId/customer-reject',
  protectRouteuser,
  rejectOrderByCustomer
);

module.exports = router;