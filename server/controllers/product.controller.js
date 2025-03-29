const Product = require('../model/products.model');
const cloudinary = require('cloudinary').v2;
const { protectRoutestore } = require('../middleware/authmiddleware');

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const store = req.store;
    
    // Parse bulk pricing from FormData
    let bulkPricing = [];
    if (req.body.bulkPricing) {
      try {
        bulkPricing = Array.isArray(req.body.bulkPricing) 
          ? req.body.bulkPricing 
          : JSON.parse(req.body.bulkPricing);
        
        // Validate bulk pricing structure
        if (!Array.isArray(bulkPricing)) {
          return res.status(400).json({ error: 'Bulk pricing must be an array' });
        }
        
        // Convert string numbers to actual numbers
        bulkPricing = bulkPricing.map(bp => ({
          minQuantity: Number(bp.minQuantity),
          price: Number(bp.price)
        }));
      } catch (err) {
        console.error('Bulk pricing parse error:', err);
        return res.status(400).json({ error: 'Invalid bulk pricing format' });
      }
    }

    // Validate required fields
    const requiredFields = [
      'name', 'description', 'category', 'grade',
      'weightPerUnit', 'unit', 'manufacturerName',
      'basePrice', 'stock'
    ];
    
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        missingFields
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Product image is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'products' }
    );

    // Create new product
    const product = new Product({
      storeId: store._id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      grade: req.body.grade,
      weightPerUnit: req.body.weightPerUnit,
      unit: req.body.unit,
      manufacturer: {
        name: req.body.manufacturerName,
        country: req.body.manufacturerCountry || ''
      },
      basePrice: req.body.basePrice,
      bulkPricing: bulkPricing,
      stock: req.body.stock,
      specifications: req.body.specifications || '',
      image: result.secure_url
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const store = req.store;
    const productId = req.params.id;

    // Parse bulk pricing from FormData
    let bulkPricing;
    if (req.body.bulkPricing) {
      try {
        bulkPricing = Array.isArray(req.body.bulkPricing)
          ? req.body.bulkPricing
          : JSON.parse(req.body.bulkPricing);
        
        // Validate bulk pricing structure
        if (!Array.isArray(bulkPricing)) {
          return res.status(400).json({ error: 'Bulk pricing must be an array' });
        }
        
        // Convert string numbers to actual numbers
        bulkPricing = bulkPricing.map(bp => ({
          minQuantity: Number(bp.minQuantity),
          price: Number(bp.price)
        }));
      } catch (err) {
        console.error('Bulk pricing parse error:', err);
        return res.status(400).json({ error: 'Invalid bulk pricing format' });
      }
    }

    // Prepare updates
    const updates = {};
    
    // Allow all fields to be updated except image (handled separately)
    const updatableFields = [
      'description', 'category', 'grade', 'weightPerUnit',
      'unit', 'basePrice', 'stock', 'specifications'
    ];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    // Handle manufacturer updates
    if (req.body.manufacturerName || req.body.manufacturerCountry) {
      updates.manufacturer = {
        name: req.body.manufacturerName || '',
        country: req.body.manufacturerCountry || ''
      };
    }
    
    // Handle bulk pricing updates
    if (bulkPricing) {
      updates.bulkPricing = bulkPricing;
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, storeId: store._id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Get all products for a store
exports.getStoreProducts = async (req, res) => {
  try {
    const store = req.store;
    const { page = 1, limit = 10, search = '', filter = 'all' } = req.query;
    
    const query = { storeId: store._id };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { grade: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      products,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const store = req.store;
    const productId = req.params.id;

    const product = await Product.findOneAndDelete({ 
      _id: productId, 
      storeId: store._id 
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};