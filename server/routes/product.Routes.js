const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/Multermiddleware');
const { protectRoutestore } = require('../middleware/authmiddleware');

// Add new product
router.post(
  '/', 
  protectRoutestore,
  upload.single('image'),
  productController.addProduct
);

// Get store products
router.get(
  '/', 
  protectRoutestore,
  productController.getStoreProducts
);

// Update product
router.put(
  '/:id', 
  protectRoutestore,
  upload.none(), // Important: Use upload.none() for PUT requests
  productController.updateProduct
);

// Delete product
router.delete(
  '/:id', 
  protectRoutestore,
  productController.deleteProduct
);

module.exports = router;