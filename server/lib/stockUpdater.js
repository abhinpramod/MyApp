const Product = require('../model/products.model');


const updateProductStock = async (items, operation = 'decrement') => {
  console.log( "this is the iteams ",items,".............");
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