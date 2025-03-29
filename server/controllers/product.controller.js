const Product = require('../model/products.model');
const cloudinary = require('cloudinary').v2;
const { protectRoutestore } = require('../middleware/authmiddleware');

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const store = req.store;
    const { 
      name, description, category, grade, 
      weightPerUnit, unit, basePrice, stock,
      specifications, isActive 
    } = req.body;

    // Parse manufacturer and bulk pricing
    const manufacturer = {
      name: req.body.manufacturerName,
      country: req.body.manufacturerCountry
    };

    let bulkPricing = [];
    if (req.body.bulkPricing) {
      try {
        bulkPricing = JSON.parse(req.body.bulkPricing);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid bulk pricing format' });
      }
    }

    // Validate required fields
    if (!req.file || !name || !description || !category || !grade || 
        !weightPerUnit || !unit || !basePrice || !stock || !manufacturer.name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      { folder: 'products' }
    );

    // Create new product
    const product = new Product({
      storeId: store._id,
      name,
      description,
      category,
      grade,
      weightPerUnit,
      unit,
      manufacturer,
      basePrice,
      bulkPricing,
      stock,
      specifications,
      isActive,
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
    
    if (filter === 'active') {
      query.isActive = true;
    } else if (filter === 'inactive') {
      query.isActive = false;
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

// Update product (except name and image)
exports.updateProduct = async (req, res) => {
  try {
    const store = req.store;
    const productId = req.params.id;
    const updates = req.body;

    // Don't allow name or image updates
    if (updates.name || updates.image) {
      return res.status(400).json({ error: 'Product name and image cannot be updated' });
    }

    // Parse bulk pricing if provided
    if (updates.bulkPricing) {
      try {
        updates.bulkPricing = JSON.parse(updates.bulkPricing);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid bulk pricing format' });
      }
    }

    // Parse manufacturer if provided
    if (updates.manufacturerName || updates.manufacturerCountry) {
      updates.manufacturer = {
        name: updates.manufacturerName,
        country: updates.manufacturerCountry
      };
      delete updates.manufacturerName;
      delete updates.manufacturerCountry;
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, storeId: store._id },
      updates,
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