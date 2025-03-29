const mongoose = require('mongoose');

const bulkPricingSchema = new mongoose.Schema({
  minQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Cement', 'Steel', 'Wood', 'Bricks', 'Aggregates', 'Other']
  },
  grade: {
    type: String,
    required: true,
    trim: true
  },
  weightPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'ton', 'piece', 'bag', 'cubic meter', 'square meter']
  },
  manufacturer: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      trim: true
    }
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  bulkPricing: [bulkPricingSchema],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  specifications: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);