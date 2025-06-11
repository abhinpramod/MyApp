// routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { protectRouteuser } = require("../middleware/authmiddleware");
// const authMiddleware = require("../middleware/authMiddleware");
// const {protectRouteuser}= require("../middleware/authmiddleware");

// Add/update review
router.post("/:storeId", protectRouteuser, reviewController.createReview);

// Get store reviews
router.get("/:storeId", reviewController.getStoreReviews);

module.exports = router;


