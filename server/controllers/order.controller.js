const Order = require('../model/Orders.model');
const Cart = require('../model/cart'); // Assuming you have a Cart model
const Product = require('../model/products.model'); // Assuming you have a Product model

const createOrder = async (req, res) => {
  try {
    const { storeId, items, totalAmount } = req.body;
    const userId = req.user._id; // Assuming you have user auth middleware

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'No items in order' 
      });
    }

    // Check product availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`
        });
      }
    }

    // Create the order
    const order = new Order({
      user: userId,
      store: storeId,
      items,
      totalAmount
    });

    // Save the order
    await order.save();

    // Update product stocks
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear the user's cart (optional)
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [], totalPrice: 0 } }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


module.exports = { createOrder };