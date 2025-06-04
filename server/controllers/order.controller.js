const Order = require('../model/Orders.model');
const Cart = require('../model/cart');
const Product = require('../model/products.model');
const User = require('../model/user.model');
const Store = require('../model/store.model');
const sendEmail = require('../lib/nodemailer');
const { updateProductStock } = require('../lib/stockUpdater');
const mongoose = require('mongoose');


// Create new order
const createOrder = async (req, res) => {
  try {
    const { storeId, items, totalAmount, shippingInfo,  } = req.body;
    const userId = req.user._id;

    // Basic validation
    if (!storeId || !items?.length || !shippingInfo) {
      return res.status(400).json({ success: false, message: 'Store ID, items, and shipping information are required' });
    }

    // 1. Verify user and store exist
    const [user, store] = await Promise.all([
      User.findById(userId),
      Store.findById(storeId)
    ]);
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    // 2. Check for existing pending order without transportation charge
    const existingOrder = await Order.findOne({
      userId,
      storeId,
      status: 'pending',
      transportationCharge: { $exists: true, $eq: 0 }
    });

    // 3. Prepare order items with product details
    const orderItems = [];
    const productIdsInRequest = items.map(item => item.productId.toString());
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      
      // Ensure basePrice is included and has a default value if not provided
      const basePrice = item.basePrice || item.price || product.basePrice || 0;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || basePrice,
        basePrice: basePrice, 
        productDetails: {
          name: product.name,
          image: product.image,
          weightPerUnit: product.weightPerUnit,
          unit: product.unit
        }
      });
    }

    // 4. Calculate totals for the new items
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = subtotal;

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        success: false, 
        message: `Total amount mismatch (calculated: ${calculatedTotal}, received: ${totalAmount})` 
      });
    }

    let order;
    if (existingOrder) {
      // Check for duplicate products in existing order and new items
      const existingItemsMap = new Map();
      existingOrder.items.forEach(item => {
        existingItemsMap.set(item.productId.toString(), item);
      });

      // Process each new item
      for (const newItem of orderItems) {
        const productIdStr = newItem.productId.toString();
        if (existingItemsMap.has(productIdStr)) {
          // Product exists in order - update quantity
          const existingItem = existingItemsMap.get(productIdStr);
          existingItem.quantity += newItem.quantity;
        } else {
          // New product - add to order
          existingOrder.items.push(newItem);
        }
      }

      // Recalculate totals
      const newSubtotal = existingOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      existingOrder.subtotal = newSubtotal;
      existingOrder.totalAmount = newSubtotal;
      
      // Update shipping info if provided (optional)
      if (shippingInfo) {
        existingOrder.shippingInfo = shippingInfo;
      }
      
      await existingOrder.save();
      order = existingOrder;
    } else {
      // Create new order
      order = new Order({
        userId,
        storeId,
        items: orderItems,
        subtotal,
        totalAmount: calculatedTotal,
        transportationCharge: 0, // Initialize as 0
        shippingInfo,
        status: 'pending',
        // paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        storeDetails: {
          storeName: store.storeName,
          city: store.city,
          state: store.state
        },
        userDetails: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber
        }
      });
      await order.save();
    }

    // 5. Update cart - remove ordered items
    await Cart.updateMany(
      { userId },
      { $pull: { items: { productId: { $in: items.map(i => i.productId) } } } }
    );

    res.status(201).json({ 
      success: true, 
      order,
      message: existingOrder ? 'Order updated successfully' : 'Order created successfully' 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

const getnotifications = async (req, res) => {
  try {
    const notifications = await Order.find({ storeId: req.store._id, status: 'pending',deleverychargeadded:false });
    count = notifications.length;
    console.log('countof notifications  ',count);
    res.status(200).json( count );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}

const tobedelevercount = async (req, res) => {
  try {
    const notifications = await Order.find({ storeId: req.store._id, deleverystatus: 'pending',deleverychargeadded:true });
    count = notifications.length;
    console.log('countof notifications...  ',count);
    res.status(200).json( count );
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
}

const getOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentStatus, 
      paymentMethod,
      search,
      filterType, // 'new', 'rejected', 'to-be-delivered', 'out-for-delivery', 'delivered'
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Validate storeId
    if (!req.store || !req.store._id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Store ID is required' 
      });
    }

    // Build filter object
    const filter = { storeId: req.store._id };
    
    // Handle filterType
    if (filterType) {
      switch(filterType) {
        case 'new':
          filter.status = 'pending';
          filter.transportationCharge = 0;
          break;
        case 'rejected':
          filter.status = 'cancelled';
          filter.rejectionReason = { $exists: true, $ne: '' };
          break;
        case 'to-be-delivered':
          filter.deleverystatus = 'pending';
          filter.transportationCharge = { $gt: 0 };
          // filter.paymentStatus = 'paid';
          
          break;
        case 'out-for-delivery':
          filter.deleverystatus = 'out-for-delivery';
          break;
        case 'delivered':
          filter.deleverystatus = 'delivered';
          break;
        default:
          // Unknown filterType - ignore it
          break;
      }
    } else {
      // Apply individual filters only if no filterType is specified
      if (status) filter.status = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      if (paymentMethod) filter.paymentMethod = paymentMethod;
    }
    
    // Enhanced search functionality
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchConditions = [
        { 'userDetails.name': searchRegex },
        { 'userDetails.email': searchRegex },
        { 'shippingInfo.phoneNumber': searchRegex },
        { 'items.productDetails.name': searchRegex }
      ];
      
      // If search looks like an order ID (last 6 chars)
      if (/^[a-f0-9]{6}$/i.test(search)) {
        searchConditions.push({ 
          $expr: { 
            $eq: [
              { $substr: [{ $toString: "$_id" }, -6, 6] },
              search.toLowerCase()
            ]
          }
        });
      }
      
      filter.$or = searchConditions;
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    // Execute query
    const ordersQuery = Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const [orders, total] = await Promise.all([
      ordersQuery.exec(),
      Order.countDocuments(filter)
    ]);

    res.status(200).json({ 
      success: true, 
      orders,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit),
      message: 'Orders fetched successfully' 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

// Get count of new orders (pending with no transportation charge)


// Get count of to-be-delivered orders



// Update delivery status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const validStatuses = ['pending', 'out-for-delivery', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery status'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { deleverystatus: status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If status is delivered, also update the main order status
    if (status === 'delivered') {
      await Order.findByIdAndUpdate(
        orderId,
        { status: 'delivered' }
      );
    }

    res.status(200).json({
      success: true,
      order: updatedOrder,
      message: 'Delivery status updated successfully'
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

const cheakpaymetstatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    const orders = await Order.find({ _id: orderId});
    res.status(200).json({ 
      success: true, 
      orders,
      message: 'Orders fetched successfully' 
    });
  } catch (error) {
    console.error('Error fetching orders ...:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
}
const getOrdersforconfirmation = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id, status: 'pending' ,deleverychargeadded:true });
    res.status(200).json({ 
      success: true, 
      orders,
      message: 'Orders fetched successfully' 
    });
  } catch (error) {
    // console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
  
}

const getOrdersuser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.status(200).json({ 
      success: true, 
      orders,
      message: 'Orders fetched successfully' 
    });
  } catch (error) {
    // console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
  
}

const rejectOrderByCustomer = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rejectionReason } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid rejection reason (minimum 10 characters)'
      });
    }

    // Find the order - must belong to user and have delivery charge added
    const order = await Order.findOne({
      _id: orderId,
      userId,
      deleverychargeadded: true,
      status: 'pending'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not eligible for rejection'
      });
    }

    // Update order status and details
    order.status = 'cancelled';
    order.rejectionReason = rejectionReason.trim();
    order.cancelledBy = 'customer';
    order.cancelledAt = new Date();
    
    // If payment was already made, mark for refund
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refund_pending';
    }

    await order.save();

    // Notify store owner
    await sendEmail(
      order.storeDetails.email, // Assuming store email is in storeDetails
      'Order Rejected by Customer',
      `Order #${order._id.toString().slice(-6)} was rejected by customer. Reason: ${rejectionReason}`
    );

    res.status(200).json({
      success: true,
      message: 'Order rejected successfully',
      data: {
        orderId: order._id,
        status: order.status,
        cancelledAt: order.cancelledAt
      }
    });

  } catch (error) {
    console.error('Customer order rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject order',
      error: error.message
    });
  }
};

// Update transportation charge
const updateTransportationCharge = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { transportationCharge } = req.body;

    // Validate input
    if (isNaN(transportationCharge)) {
      return res.status(400).json({
        success: false,
        message: 'Transportation charge must be a number'
      });
    }

    const order = await Order.findOneAndUpdate(
      { 
        _id: orderId,
        storeId: req.store._id,
        status: 'pending' // Only allow updates for pending orders
      },
      { 
        transportationCharge: Number(transportationCharge),
        totalAmount: await calculateTotalAmount(orderId, Number(transportationCharge)),
        deleverychargeadded: true
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or not in pending status'
      });
    }

    res.status(200).json({
      success: true,
      order,
      message: 'Transportation charge updated successfully'
    });
    sendEmail(order.userDetails.email, 'Transportation Charge Updated', `Your transportation charge has been updated to ${transportationCharge}and the total amount is ${order.totalAmount}. confirm your order.`);
    
  } catch (error) {
    console.error('Error updating transportation charge:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// controllers/orderController.js
// controllers/orderController.js

const  confirmOrder = async (req, res) => {
  const { orderIds, paymentMethod = 'cod' } = req.body;

  try {
    // Validate input
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: 'Invalid order IDs' });
    }

    // Get orders with items
    const orders = await Order.find({ 
      _id: { $in: orderIds },
      status: { $ne: 'confirmed' }
    });

    if (orders.length !== orderIds.length) {
      return res.status(400).json({ message: 'Some orders not found or already confirmed' });
    }

    // Check stock availability
    const productIds = [...new Set(orders.flatMap(order => 
      order.items.map(item => item.productId)
    ))];
    
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    for (const order of orders) {
      for (const item of order.items) {
        const product = productMap.get(item.productId.toString());
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${item.productDetails?.name || 'product'}`,
            productId: item.productId
          });
        }
      }
    }

    // Update all product stocks
    await updateProductStock(orders.flatMap(order => order.items));

    // Update orders
    const updatePromises = orders.map(order => 
      Order.findByIdAndUpdate(
        order._id,
        {
          status: 'confirmed',
          paymentMethod,
          deleverystatus: 'pending',
          paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
          updatedAt: new Date()
        },
        { new: true }
      )
    );

    const updatedOrders = await Promise.all(updatePromises);
    
    res.json({
      success: true,
      message: `Confirmed ${orders.length} orders`,
      orders: updatedOrders
    });
  } catch (error) {
    console.error('Order confirmation error:', error);
    
    if (error.message.includes('insufficient stock')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Failed to confirm orders',
      error: error.message 
    });
  }
};
// Reject order
const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rejectionReason } = req.body;

    // Validate input
    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const order = await Order.findOneAndUpdate(
      { 
        _id: orderId,
        storeId: req.store._id,
        status: { $in: ['pending', 'processing'] } // Only allow rejection for these statuses
      },
      { 
        status: 'cancelled',
        rejectionReason: rejectionReason.trim(),
        paymentStatus: req.body.paymentStatus === 'paid' ? 'refunded' : 'failed'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or cannot be rejected in current status'
      });
    }
    sendEmail(order.userDetails.email, 'Order Rejected', `Your order has been rejected. Reason: ${rejectionReason}`);

    res.status(200).json({
      success: true,
      order,
      message: 'Order rejected successfully'
    });

  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error'
    });
  }
};

// Helper function to calculate total amount
async function calculateTotalAmount(orderId, transportationCharge) {
  const order = await Order.findById(orderId);
  if (!order) return 0;
  return order.subtotal + transportationCharge;
}

module.exports = {
  createOrder,
  getOrders,
  updateTransportationCharge,
  rejectOrder,
getnotifications,
getOrdersforconfirmation,
rejectOrderByCustomer,confirmOrder,
tobedelevercount,
cheakpaymetstatus,
updateDeliveryStatus,
getOrdersuser
};