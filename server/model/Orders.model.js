const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//     default: 1
//   },
//   basePrice: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   price: {  // Actual price charged (could be same as basePrice or discounted)
//     type: Number,
//     required: true,
//     min: 0
//   },
//   productDetails: {  // Snapshot of product at time of order
//     name: String,
//     image: String,
//     category: String,
//     grade: String,
//     weightPerUnit: String,
//     unit: String
//   }
// }, { _id: false });

const OrderSchema = new mongoose.Schema({
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
    items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    basePrice: { type: Number, required: true }, // This is what's causing the error if missing
    productDetails: {
      name: String,
      image: String,
      weightPerUnit: Number,
      unit: String
    }
  }],
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
  shippingInfo: {
    phoneNumber: {
      type: String,
      required: true
    },
    address: {
      country: {
        type: String,
        required: true,
        default: 'India'
      },
      state: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      pincode: {
        type: String,
        required: true
      },
      buildingAddress: {
        type: String,
        required: true
      },
      landmark: String
    }
  },
  // Store snapshot for reference
  storeDetails: {
    storeName: String,
    city: String,
    state: String,
    profilePicture: String
  },
  // User snapshot for reference
  userDetails: {
    name: String,
    email: String,
    phoneNumber: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);