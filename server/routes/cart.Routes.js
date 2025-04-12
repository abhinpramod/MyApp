const express = require("express");
const router = express.Router();
const { addToCart, getCart, updateCartItem, removeCartItem, clearCart, getCartStores } = require("../controllers/cart.controller");
const { protectRouteuser } = require("../middleware/authmiddleware");  

router.post("/add-to-cart", protectRouteuser, addToCart);
router.get('/',   protectRouteuser,  getCart);

// Get stores in user's cart
router.get('/stores',   protectRouteuser,  getCartStores);

// Add to cart
// router.post('/add',   protectRouteuser,  addToCart);

// Update cart item quantity
router.put('/update',   protectRouteuser,  updateCartItem);

// Remove item from cart
router.post('/remove',   protectRouteuser,  removeCartItem);

// Clear cart
router.delete('/clear',   protectRouteuser,  clearCart);
module.exports = router;