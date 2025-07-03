// controllers/paymentController.js
const Stripe = require('stripe');
const dotenv = require("dotenv");
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Order = require('../model/Orders.model');
// const Order = require('../model/order.model');
const Product = require('../model/products.model');
const {updateProductStock}=require('../lib/stockUpdater');
exports.createCheckoutSession = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Map products into Stripe line items
    const line_items = order.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.productDetails.name,
        },
        unit_amount: Math.round(item.price * 100), // in paise
      },
      quantity: item.quantity,
    }));

    // Add transportation charge as a separate line item if > 0
    if (order.transportationCharge > 0) {
      line_items.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Transportation Charge',
          },
          unit_amount: Math.round(order.transportationCharge * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: order.userDetails.email,
      line_items,
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      metadata: { orderId: order._id.toString() }
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ message: 'Stripe payment failed',error: error.message });
  }
};

// controllers/paymentController.js



exports.verifyPayment = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await updateProductStock(order.items);

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        status: 'confirmed',
        paymentMethod: 'online',
        deleverystatus: 'pending'
      },
      { new: true }
    );

    res.json({ 
      success: true, 
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    if (error.message.includes('insufficient stock')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.message 
    });
  }
};
