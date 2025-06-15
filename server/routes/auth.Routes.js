// authRoutes.js
const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/authMiddlewareunified");
const { checkAuth } = require("../controllers/auth.Controller");

router.get("/check", protectRoute, checkAuth);

module.exports = router;