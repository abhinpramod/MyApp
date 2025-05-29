const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        basePrice: { type: Number, required: true },
        productDetails: {
          name: String,
          image: String,
          weightPerUnit: Number,
          unit: String,
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    transportationCharge: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rejectionReason: String,
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deleverychargeadded: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
    },
      paymentDetails: {
    paymentId: String,
    paymentMethod: String,
    paymentDate: Date
  },
    shippingInfo: {
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        country: {
          type: String,
          required: true,
          default: "India",
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        pincode: {
          type: String,
          required: true,
        },
        buildingAddress: {
          type: String,
          required: true,
        },
        landmark: String,
      },
    },

    deleverystatus: {
      type: String,
      enum: ["pending", "delivered","out for delivery"],
      default: "pending",
    },
    // Store snapshot for reference
    storeDetails: {
      storeName: String,
      city: String,
      state: String,
      profilePicture: String,
    },
    // User snapshot for reference
    userDetails: {
      name: String,
      email: String,
      phoneNumber: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
