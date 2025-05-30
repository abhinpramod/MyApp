// utils/stockUpdater.js
const Product = require('../model/products.model');

const updateProductStock = async (items, operation = 'decrement') => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { 
          $inc: { stock: operation === 'decrement' ? -item.quantity : item.quantity } 
        }
      }
    }));

    await Product.bulkWrite(bulkOps, { session });
    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Stock update error:', error);
    throw error;
  }
};

module.exports = { updateProductStock };