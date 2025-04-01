const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/Multermiddleware');
const { protectRoutestore } = require('../middleware/authmiddleware');

// Add new product
router.post(
  '/store', 
  protectRoutestore,
  upload.single('image'),
  productController.addProduct
);

// Get store products
router.get(
  '/store', 
  protectRoutestore,
  productController.getStoreProducts
);


// GET /api/products - Get all products with filters
router.get('/', productController.fetchAllProducts);

// GET /api/products/:id - Get single product
router.get('/:id', productController.getProductById);
// Update product
router.put(
  '/store/:id', 
  protectRoutestore,
  upload.none(), // Important: Use upload.none() for PUT requests
  productController.updateProduct
);

// Delete product
router.delete(
  '/store/:id', 
  protectRoutestore,
  productController.deleteProduct
);

module.exports = router;