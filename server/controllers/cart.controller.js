const Cart = require('../model/cart');
const Product = require('../model/products.model');
const Store = require('../model/store.model');

// Get user's cart with populated product and store details
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all carts for the user
    const carts = await Cart.find({ userId })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'name description image category grade weightPerUnit unit basePrice stock specifications storeId'
      })
      .populate({
        path: 'storeId',
        model: 'Store',
        select: 'storeName city state description profilePicture storeImage'
      });

    if (!carts || carts.length === 0) {
      return res.status(200).json({ success: true, carts: [] });
    }

    // Combine all items from all carts into a single response
    const combinedCart = {
      _id: carts[0]._id, // Using first cart ID as reference
      userId,
      items: [],
      totalPrice: 0
    };

    carts.forEach(cart => {
      combinedCart.items.push(...cart.items.map(item => ({
        ...item.toObject(),
        productDetails: item.productId,
        storeDetails: cart.storeId
      })));
      combinedCart.totalPrice += cart.totalPrice;
    });

    res.status(200).json({ success: true, cart: combinedCart });
  } catch (error) {
    console.error("Error getting cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    // Find the cart
    const cart = await Cart.findOne({ _id: cartId, userId })
      .populate({
        path: 'items.productId',
        model: 'Product'
      });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item.productId._id.equals(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    const product = cart.items[itemIndex].productId;

    // Check stock availability
    if (quantity > product.stock) {
      return res.status(400).json({ 
        success: false, 
        message: `Requested quantity exceeds available stock (${product.stock})` 
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  try {
    const { cartId, productId } = req.body;
    const userId = req.user._id;

    // Find the cart
    const cart = await Cart.findOne({ _id: cartId, userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Remove the item
    cart.items = cart.items.filter(item => !item.productId.equals(productId));

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);

    // If no items left, delete the cart
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cartId);
      return res.status(200).json({ success: true, message: "Cart is now empty" });
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.deleteMany({ userId });
    res.status(200).json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get stores present in user's cart
const getCartStores = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const carts = await Cart.find({ userId })
      .populate({
        path: 'storeId',
        model: 'Store',
        select: 'storeName city state description profilePicture storeImage'
      });

    if (!carts || carts.length === 0) {
      return res.status(200).json({ success: true, stores: [] });
    }

    const stores = carts.map(cart => cart.storeId);
    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error("Error getting cart stores:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

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

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartStores
};