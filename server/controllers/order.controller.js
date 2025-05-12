const Order = require('../model/Orders.model');
const Cart = require('../model/cart');
const Product = require('../model/products.model');
const User = require('../model/user.model');
const Store = require('../model/store.model');
const mongoose = require('mongoose');

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { storeId, items, totalAmount, shippingInfo, paymentMethod = 'cod' } = req.body;
    const userId = req.user._id;
    console.log(storeId,"after the store id", items, totalAmount, shippingInfo, paymentMethod);
       if (!storeId ) {
         return res.status(400).json({ success: false, message: 'select a store' });
       }
    // Validate required fields
    if (!storeId || !items || !items.length || !shippingInfo) {
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false,
        message: 'Store ID, items, and shipping information are required' 
      });
    }

    // Get user and store details
    const [user, store] = await Promise.all([
      User.findById(userId).session(session),
      Store.findById(storeId).session(session)
    ]);

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!store) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Prepare order items with product details
    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        basePrice: item.basePrice,
        price: item.price || item.basePrice, // Use applied price if available
        productDetails: {
          name: product.name,
          image: product.image,
          category: product.category,
          grade: product.grade,
          weightPerUnit: product.weightPerUnit,
          unit: product.unit
        }
      };
    }));

    // Calculate subtotal
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const transportationCharge = 0; // Can be calculated later

    // Create order
    const order = new Order({
      userId,
      storeId,
      items: orderItems,
      subtotal,
      transportationCharge,
      totalAmount: subtotal + transportationCharge,
      shippingInfo,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      storeDetails: {
        storeName: store.storeName,
        city: store.city,
        state: store.state,
        profilePicture: store.profilePicture
      },
      userDetails: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      }
    });

    // Validate total amount
    if (Math.abs(order.totalAmount - totalAmount) > 0.01) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Total amount mismatch. Calculated: ${order.totalAmount}, Received: ${totalAmount}`
      });
    }

    // Save order
    await order.save({ session });

    // Remove ordered items from cart
    await Cart.updateMany(
      { userId },
      { $pull: { items: { productId: { $in: items.map(i => i.productId) } } } },
      { session }
    );

    // Update cart totals
    const carts = await Cart.find({ userId }).session(session);
    for (const cart of carts) {
      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id).session(session);
      } else {
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
        cart.totalSavings = cart.items.reduce((sum, item) => sum + (item.savings || 0), 0);
        await cart.save({ session });
      }
    }

    await session.commitTransaction();
    
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
      message: error.message || 'Failed to create order'
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder
};