const mongoose = require('mongoose');

// Define the item schema first
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true
    },
    items: [orderItemSchema],  // Array of ordered items
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    transportationCharge: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'online', 'wallet'],
      default: 'cod'
    },
    deliveryAddress: {
      addressLine1: {
        type: String,
        required: true
      },
      addressLine2: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      postalCode: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      }
    },
    contactNumber: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);