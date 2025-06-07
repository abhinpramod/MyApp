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

// Get cart contents
router.get('/', protectRouteuser, getCart);

// Get stores in user's cart
router.get('/stores', protectRouteuser, getCartStores);

// Add item to cart
router.post('/add-to-cart', protectRouteuser, addToCart);

// Update cart item quantity
router.put('/update', protectRouteuser, updateCartItem);

// Remove item from cart
router.delete('/remove', protectRouteuser, removeCartItem);

// Remove all items from a specific store
router.post ('/remove-store',
protectRouteuser, removeStoreFromCart);

// Clear entire cart
router.delete('/clear', protectRouteuser, clearCart);
 
router.get("/store", protectRoutestore, storecart);

module.exports = router;