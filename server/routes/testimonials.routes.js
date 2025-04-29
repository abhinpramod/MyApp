const express = require("express");
const router = express.Router();
const { getAllTestimonials } = require("../controllers/testimonials.controller");
router.get("/", getAllTestimonials);
module.exports = router;