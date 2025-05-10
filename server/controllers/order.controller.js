const Order = require('../model/Orders.model');
const Cart = require('../model/cart');
const Product = require('../model/products.model');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { storeId, items, totalAmount, shippingInfo } = req.body;
    
    // Validate required fields
    if (!items || !items.length) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false,
        message: 'No items in order' 
      });
    }

    // Validate shipping info
    if (!shippingInfo || !shippingInfo.phoneNumber || !shippingInfo.address) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Shipping information is incomplete'
      });
    }

    // Check product availability and validate prices
    let calculatedTotal = 0;
    const productUpdates = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);
      
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`
        });
      }
      
      if (product.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product: ${product.name}`
        });
      }
      
      if (product.price !== item.price) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Price mismatch for product: ${product.name}`
        });
      }
      
      calculatedTotal += item.price * item.quantity;
      productUpdates.push({
        updateOne: {
          filter: { _id: item.productId },
          update: { $inc: { stock: -item.quantity } }
        }
      });
    }

    // Validate total amount matches calculated total
    if (calculatedTotal !== totalAmount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Total amount does not match calculated order total'
      });
    }

    // Generate order number (example: ORD-20230510-0001)
    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${(orderCount + 1).toString().padStart(4, '0')}`;

    // Create order
    const order = new Order({
      user: req.user._id,
      store: storeId,
      items,
      totalAmount,
      shippingInfo,
      status: 'pending',
      orderNumber,
      paymentStatus: 'pending' // You might want to add this
    });

    await order.save({ session });

    // Update product stocks
    if (productUpdates.length > 0) {
      await Product.bulkWrite(productUpdates, { session });
    }

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], totalPrice: 0 } },
      { session, new: true }
    );

    await session.commitTransaction();
    
    // TODO: Send order confirmation email (consider doing this outside the transaction)
    
    res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully' 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    session.endSession();
  }
};

module.exports = { createOrder };