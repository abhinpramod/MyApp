const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },    
    imagepublicid: { type: String, require: true }
  },
  { timestamps: true }
);

const ProductType = mongoose.model('ProductType', productTypeSchema);
module.exports = ProductType;