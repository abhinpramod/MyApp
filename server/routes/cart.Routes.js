const express = require("express");
const router = express.Router();
const { addToCart } = require("../controllers/cart.controller");
const { protectRouteuser } = require("../middleware/authmiddleware");

router.post("/add-to-cart", protectRouteuser, addToCart);
// router.get("/get-cart", protectRouteuser, getCart);
// router.delete("/remove-from-cart", protectRouteuser, removeFromCart);

module.exports = router;