const Order = require('../model/Orders.model');
const Cart = require('../model/cart');
const Product = require('../model/products.model');
const User = require('../model/user.model');
const Store = require('../model/store.model');

const createOrder = async (req, res) => {
  try {
    const { storeId, items, totalAmount, shippingInfo, paymentMethod = 'cod' } = req.body;
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

    // 2. Prepare order items with product details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
      
      // Ensure basePrice is included and has a default value if not provided
      const basePrice = item.basePrice || item.price || product.basePrice || 0;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || basePrice,
        basePrice: basePrice, // Make sure this is included
        productDetails: {
          name: product.name,
          image: product.image,
          weightPerUnit: product.weightPerUnit,
          unit: product.unit
        }
      });
    }

    // 3. Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculatedTotal = subtotal;

    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        success: false, 
        message: `Total amount mismatch (calculated: ${calculatedTotal}, received: ${totalAmount})` 
      });
    }

    // 4. Create the order
    const order = new Order({
      userId,
      storeId,
      items: orderItems,
      subtotal,
      totalAmount: calculatedTotal,
      shippingInfo,
      paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
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

    // 5. Update cart - remove ordered items
    await Cart.updateMany(
      { userId },
      { $pull: { items: { productId: { $in: items.map(i => i.productId) } } } }
    );

    res.status(201).json({ 
      success: true, 
      order,
      message: 'Order created successfully' 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error' 
    });
  }
};

module.exports = {
  createOrder
};