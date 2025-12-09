const express = require("express");
const router = express.Router();
const { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getCartStores,
  removeStoreFromCart ,
  storecart
} = require("../controllers/cart.controller");
const { protectRouteuser,protectRoutestore } = require("../middleware/authmiddleware");  

router.get('/', protectRouteuser, getCart);

router.get('/stores', protectRouteuser, getCartStores);

router.post('/add-to-cart', protectRouteuser, addToCart);

router.put('/update', protectRouteuser, updateCartItem);

router.delete('/remove', protectRouteuser, removeCartItem);

router.post ('/remove-store',
protectRouteuser, removeStoreFromCart);

router.delete('/clear', protectRouteuser, clearCart);
 
router.get("/store", protectRoutestore, storecart);

module.exports = router;