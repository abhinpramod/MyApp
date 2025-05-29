// // routes/webhook.js
// const express = require('express');
// const router = express.Router();
// const Stripe = require('stripe');
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// const Order = require('../model/Orders.model');

// router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;
    
//     try {
//       // Retrieve the order ID from session metadata
//       const orderId = session.metadata.orderId;
//       if (!orderId) {
//         console.error('No order ID in session metadata');
//         return res.status(400).json({ error: 'No order ID in metadata' });
//       }

//       // Verify payment status
//       if (session.payment_status === 'paid') {
//         await Order.findByIdAndUpdate(orderId, {
//           paymentStatus: 'paid',
//           status: 'confirmed',


//           paymentDetails: {
//             paymentId: session.payment_intent,
//             paymentMethod: 'card',
//             paymentDate: new Date()
//           }
//         });
//         console.log(`Order ${orderId} updated to paid status`);
//       }
//     } catch (error) {
//       console.error('Error processing webhook:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   }

//   res.json({ received: true });
// });

// module.exports = router;