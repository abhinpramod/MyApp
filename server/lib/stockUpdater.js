const Product = require('../model/products.model');

/**
 * Updates stock for multiple products
 * @param {Array} items - Array of order items with productId and quantity
 * @param {string} [operation='decrement'] - 'decrement' or 'increment'
 */
const updateProductStock = async (items, operation = 'decrement') => {
  const bulkOps = items.map(item => ({
    updateOne: {
      filter: { 
        _id: item.productId,
        stock: operation === 'decrement' ? { $gte: item.quantity } : { $exists: true }
      },
      update: { 
        $inc: { stock: operation === 'decrement' ? -item.quantity : item.quantity } 
      }
    }
  }));

  const result = await Product.bulkWrite(bulkOps);
  
  // Check if any operations didn't match (insufficient stock)
  if (result.modifiedCount !== items.length) {
    const failedCount = items.length - result.modifiedCount;
    throw new Error(`${failedCount} products had insufficient stock or weren't found`);
  }

  return result;
};

module.exports = { updateProductStock };