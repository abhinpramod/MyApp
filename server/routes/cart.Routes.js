const express = require("express");
const router = express.Router();
const { 
  addToCart, 
  getCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getCartStores,
  removeStoreFromCart 
} = require("../controllers/cart.controller");
const { protectRouteuser } = require("../middleware/authmiddleware");  

// Get cart contents
router.get('/', protectRouteuser, getCart);

// Get stores in user's cart
router.get('/stores', protectRouteuser, getCartStores);

// Add item to cart
router.post('/add-to-cart', protectRouteuser, addToCart);

// Update cart item quantity
router.put('/items', protectRouteuser, updateCartItem);

// Remove item from cart
router.delete('/items', protectRouteuser, removeCartItem);

// Remove all items from a specific store
router.post ('/remove-store',
protectRouteuser, removeStoreFromCart);

// Clear entire cart
router.delete('/', protectRouteuser, clearCart);
 
module.exports = router;