const Product = require('../model/products.model');
const Cart = require('../model/cart');
const user = require('../model/user.model');
const store = require('../model/store.model');



const addToCart = async (req, res) => {
  try {
    const { storeId, productId, quantity } = req.body;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if requested quantity exceeds available stock
    if (quantity > product.stock) {
      return res.status(400).json({ 
        success: false, 
        message: `Requested quantity exceeds available stock (${product.stock})` 
      });
    }

    let cart = await Cart.findOne({ userId, storeId });

    // Function to calculate price and discount based on bulk pricing if available
    const calculatePricing = (product, qty) => {
      const originalPrice = product.basePrice;
      let appliedPrice = originalPrice;
      let bulkTier = null;
      let discount = 0;

      if (product.bulkPricing && product.bulkPricing.length > 0) {
        // Sort bulk pricing by minQuantity in descending order
        const sortedBulkPricing = [...product.bulkPricing].sort((a, b) => b.minQuantity - a.minQuantity);
        
        // Find the first bulk pricing tier that matches the quantity
        bulkTier = sortedBulkPricing.find(tier => qty >= tier.minQuantity);
        
        if (bulkTier) {
          appliedPrice = bulkTier.price;
          discount = originalPrice - appliedPrice;
        }
      }
      
      return {
        originalPrice,
        appliedPrice,
        bulkTier,
        discount,
        savings: discount * qty
      };
    };

    if (cart) {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // If exists, update quantity and recalculate price
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        const pricing = calculatePricing(product, newQuantity);
        
        cart.items[itemIndex] = {
          ...cart.items[itemIndex].toObject(),
          quantity: newQuantity,
          originalPrice: pricing.originalPrice,
          basePrice: pricing.appliedPrice,
          bulkTier: pricing.bulkTier,
          discountPerUnit: pricing.discount,
          savings: pricing.savings
        };
      } else {
        // Else, add new product with calculated price
        const pricing = calculatePricing(product, quantity);
        cart.items.push({
          productId,
          quantity,
          originalPrice: pricing.originalPrice,
          basePrice: pricing.appliedPrice,
          bulkTier: pricing.bulkTier,
          discountPerUnit: pricing.discount,
          savings: pricing.savings
        });
      }
    } else {
      // If no cart exists, create new cart with calculated price
      const pricing = calculatePricing(product, quantity);
      cart = new Cart({
        userId,
        storeId,
        items: [{
          productId,
          quantity,
          originalPrice: pricing.originalPrice,
          basePrice: pricing.appliedPrice,
          bulkTier: pricing.bulkTier,
          discountPerUnit: pricing.discount,
          savings: pricing.savings
        }],
      });
    }

    // Recalculate total price and total savings
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.basePrice, 0);
    cart.totalSavings = cart.items.reduce((sum, item) => sum + (item.savings || 0), 0);

    await cart.save();
    res.status(200).json({ 
      success: true, 
      cart,
      message: cart.totalSavings > 0 
        ? `You saved $${cart.totalSavings.toFixed(2)} with bulk discounts!` 
        : 'Item added to cart'
    });

  } catch (error) {
    console.error("error from addToCart", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}; 

module.exports = { addToCart };
