  const Cart = require("../model/cart");
  const Product = require("../model/products.model");
  const Store = require("../model/store.model");

  // Get user's cart with populated product and store details (returns combined cart)
  const getCart = async (req, res) => {
    try {
      const userId = req.user._id;

      // Get all carts for the user with populated data
      const carts = await Cart.find({ userId })
        .populate({
          path: "items.productId",
          model: "Product",
          select: "name description image category grade weightPerUnit unit basePrice stock specifications storeId",
        })
        .populate({
          path: "storeId",
          model: "Store",
          select: "storeName city state description profilePicture storeImage",
        });

      if (!carts || carts.length === 0) {
        return res.status(200).json({ 
          success: true, 
          cart: { items: [], totalPrice: 0, totalSavings: 0 } 
        });
      }

      // Transform to single combined cart structure expected by frontend
      const combinedItems = carts.flatMap(cart => 
        cart.items.map(item => ({
          ...item.toObject(),
          productId: item.productId._id,
          productDetails: item.productId,
          storeId: cart.storeId._id,
          storeDetails: cart.storeId
        }))
      );

      const totalPrice = carts.reduce((sum, cart) => sum + cart.totalPrice, 0);
      const totalSavings = carts.reduce((sum, cart) => sum + (cart.totalSavings || 0), 0);

      res.status(200).json({ 
        success: true, 
        cart: {
          _id: "combined_cart", // Identifier for frontend
          userId,
          items: combinedItems,
          totalPrice,
          totalSavings
        }
      });
    } catch (error) {
      console.error("Error getting cart:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Update cart item quantity
  const updateCartItem = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      if (quantity < 1) {
        return res.status(400).json({ 
          success: false, 
          message: "Quantity must be at least 1" 
        });
      }

      // Find all carts for user
      const carts = await Cart.find({ userId }).populate({
        path: "items.productId",
        model: "Product",
      });

      // Debug logs
      console.log("Looking for productId:", productId);
      console.log("User has carts:", carts.length);
      carts.forEach((cart, i) => {
        console.log(`Cart ${i} has ${cart.items.length} items`);
        cart.items.forEach((item, j) => {
          console.log(`Item ${j} productId:`, item.productId?._id?.toString());
        });
      });

      // Find which cart contains the product
      let targetCart = null;
      let itemIndex = -1;
      
      for (const cart of carts) {
        itemIndex = cart.items.findIndex(item => {
          // Compare string representations of the IDs
          return item.productId?._id?.toString() === productId.toString();
        });
        
        if (itemIndex !== -1) {
          targetCart = cart;
          break;
        }
      }

      if (!targetCart) {
        return res.status(404).json({ 
          success: false, 
          message: "Item not found in any cart",
          debug: {
            requestedProductId: productId,
            availableProductIds: carts.flatMap(c => 
              c.items.map(i => i.productId?._id?.toString())
            ).filter(Boolean)
          }
        });
      }

      const product = targetCart.items[itemIndex].productId;

      // Check stock availability
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available`,
          availableStock: product.stock,
          requestedQuantity: quantity
        });
      }

      // Recalculate pricing based on new quantity
      const calculatePricing = (product, qty) => {
        const originalPrice = product.basePrice;
        let appliedPrice = originalPrice;
        let bulkTier = null;
        let discount = 0;

        if (product.bulkPricing && product.bulkPricing.length > 0) {
          const sortedBulkPricing = [...product.bulkPricing].sort(
            (a, b) => b.minQuantity - a.minQuantity
          );
          bulkTier = sortedBulkPricing.find((tier) => qty >= tier.minQuantity);
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
          savings: discount * qty,
        };
      };

      const pricing = calculatePricing(product, quantity);

      // Update the item
      targetCart.items[itemIndex] = {
        ...targetCart.items[itemIndex].toObject(),
        quantity,
        originalPrice: pricing.originalPrice,
        basePrice: pricing.appliedPrice,
        bulkTier: pricing.bulkTier,
        discountPerUnit: pricing.discount,
        savings: pricing.savings,
      };

      // Recalculate cart totals
      targetCart.totalPrice = targetCart.items.reduce(
        (sum, item) => sum + item.basePrice * item.quantity, 0
      );
      targetCart.totalSavings = targetCart.items.reduce(
        (sum, item) => sum + (item.savings || 0), 0
      );

      await targetCart.save();

      // Return updated combined cart
      const updatedCarts = await Cart.find({ userId })
        .populate({
          path: "items.productId",
          model: "Product",
        })
        .populate({
          path: "storeId",
          model: "Store",
        });

      const combinedItems = updatedCarts.flatMap(cart => 
        cart.items.map(item => ({
          ...item.toObject(),
          productId: item.productId._id,
          productDetails: item.productId,
          storeId: cart.storeId._id,
          storeDetails: cart.storeId
        }))
      );

      const totalPrice = updatedCarts.reduce((sum, cart) => sum + cart.totalPrice, 0);
      const totalSavings = updatedCarts.reduce((sum, cart) => sum + (cart.totalSavings || 0), 0);

      res.status(200).json({
        success: true,
        cart: {
          _id: "combined_cart",
          userId,
          items: combinedItems,
          totalPrice,
          totalSavings
        },
        message: "Quantity updated successfully",
        updatedItem: {
          productId: product._id,
          quantity,
          newPrice: pricing.appliedPrice,
          savings: pricing.savings
        }
      });

    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ 
        success: false, 
        message: "Server Error",
        error: error.message,
        stack: error.stack 
      });
    }
  };

  // Remove item from cart
  const removeCartItem = async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

      // Find all carts for user
      const carts = await Cart.find({ userId });

      // Find which cart contains the product
      let targetCart = null;
      
      for (const cart of carts) {
        const itemIndex = cart.items.findIndex(item => 
          item.productId.equals(productId)
        );
        if (itemIndex !== -1) {
          targetCart = cart;
          break;
        }
      }

      if (!targetCart) {
        return res.status(404).json({ 
          success: false, 
          message: "Item not found in any cart" 
        });
      }

      // Remove the item
      targetCart.items = targetCart.items.filter(
        item => !item.productId.equals(productId)
      );

      // Recalculate totals
      targetCart.totalPrice = targetCart.items.reduce(
        (sum, item) => sum + item.basePrice * item.quantity, 0
      );
      targetCart.totalSavings = targetCart.items.reduce(
        (sum, item) => sum + (item.savings || 0), 0
      );

      // If cart is empty after removal, delete it
      if (targetCart.items.length === 0) {
        await Cart.findByIdAndDelete(targetCart._id);
      } else {
        await targetCart.save();
      }

      // Return updated combined cart
      const updatedCarts = await Cart.find({ userId })
        .populate({
          path: "items.productId",
          model: "Product",
        })
        .populate({
          path: "storeId",
          model: "Store",
        });

      const combinedItems = updatedCarts.flatMap(cart => 
        cart.items.map(item => ({
          ...item.toObject(),
          productId: item.productId._id,
          productDetails: item.productId,
          storeId: cart.storeId._id,
          storeDetails: cart.storeId
        }))
      );

      const totalPrice = updatedCarts.reduce((sum, cart) => sum + cart.totalPrice, 0);
      const totalSavings = updatedCarts.reduce((sum, cart) => sum + (cart.totalSavings || 0), 0);

      res.status(200).json({
        success: true,
        cart: {
          _id: "combined_cart",
          userId,
          items: combinedItems,
          totalPrice,
          totalSavings
        },
        message: "Item removed from cart"
      });

    } catch (error) {
      console.error("Error removing cart item:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Clear entire cart (all store-specific carts)
  const clearCart = async (req, res) => {
    try {
      const userId = req.user._id;
      await Cart.deleteMany({ userId });
      res.status(200).json({ 
        success: true, 
        cart: { items: [], totalPrice: 0, totalSavings: 0 },
        message: "Cart cleared successfully" 
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Get stores present in user's cart
  const getCartStores = async (req, res) => {
    try {
      const userId = req.user._id;

      const carts = await Cart.find({ userId }).populate({
        path: "storeId",
        model: "Store",
        select: "storeName city state description profilePicture storeImage",
      });

      if (!carts || carts.length === 0) {
        return res.status(200).json({ success: true, stores: [] });
      }

      // Get unique stores
      const storesMap = new Map();
      carts.forEach(cart => {
        if (cart.storeId && !storesMap.has(cart.storeId._id.toString())) {
          storesMap.set(cart.storeId._id.toString(), cart.storeId);
        }
      });

      res.status(200).json({ 
        success: true, 
        stores: Array.from(storesMap.values()) 
      });
    } catch (error) {
      console.error("Error getting cart stores:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Add item to cart (existing implementation remains good)
  const addToCart = async (req, res) => {
    try {
      const { storeId, productId, quantity } = req.body;
      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: "Product not found" 
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available`,
          availableStock: product.stock
        });
      }

      let cart = await Cart.findOne({ userId, storeId });

      const calculatePricing = (product, qty) => {
        const originalPrice = product.basePrice;
        let appliedPrice = originalPrice;
        let bulkTier = null;
        let discount = 0;

        if (product.bulkPricing && product.bulkPricing.length > 0) {
          const sortedBulkPricing = [...product.bulkPricing].sort(
            (a, b) => b.minQuantity - a.minQuantity
          );
          bulkTier = sortedBulkPricing.find((tier) => qty >= tier.minQuantity);
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
          savings: discount * qty,
        };
      };

      if (cart) {
        const itemIndex = cart.items.findIndex(item =>
          item.productId.equals(productId)
        );

        if (itemIndex > -1) {
          const newQuantity = cart.items[itemIndex].quantity + quantity;
          const pricing = calculatePricing(product, newQuantity);

          cart.items[itemIndex] = {
            ...cart.items[itemIndex].toObject(),
            quantity: newQuantity,
            originalPrice: pricing.originalPrice,
            basePrice: pricing.appliedPrice,
            bulkTier: pricing.bulkTier,
            discountPerUnit: pricing.discount,
            savings: pricing.savings,
          };
        } else {
          const pricing = calculatePricing(product, quantity);
          cart.items.push({
            productId,
            quantity,
            originalPrice: pricing.originalPrice,
            basePrice: pricing.appliedPrice,
            bulkTier: pricing.bulkTier,
            discountPerUnit: pricing.discount,
            savings: pricing.savings,
          });
        }
      } else {
        const pricing = calculatePricing(product, quantity);
        cart = new Cart({
          userId,
          storeId,
          items: [
            {
              productId,
              quantity,
              originalPrice: pricing.originalPrice,
              basePrice: pricing.appliedPrice,
              bulkTier: pricing.bulkTier,
              discountPerUnit: pricing.discount,
              savings: pricing.savings,
            },
          ],
        });
      }

      cart.totalPrice = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.basePrice,
        0
      );
      cart.totalSavings = cart.items.reduce(
        (sum, item) => sum + (item.savings || 0),
        0
      );

      await cart.save();

      // Return the updated combined cart
      const updatedCarts = await Cart.find({ userId })
        .populate({
          path: "items.productId",
          model: "Product",
        })
        .populate({
          path: "storeId",
          model: "Store",
        });

      const combinedItems = updatedCarts.flatMap(cart => 
        cart.items.map(item => ({
          ...item.toObject(),
          productId: item.productId._id,
          productDetails: item.productId,
          storeId: cart.storeId._id,
          storeDetails: cart.storeId
        }))
      );

      const totalPrice = updatedCarts.reduce((sum, cart) => sum + cart.totalPrice, 0);
      const totalSavings = updatedCarts.reduce((sum, cart) => sum + (cart.totalSavings || 0), 0);

      res.status(200).json({
        success: true,
        cart: {
          _id: "combined_cart",
          userId,
          items: combinedItems,
          totalPrice,
          totalSavings
        },
        message: cart.totalSavings > 0
          ? `You saved $${cart.totalSavings.toFixed(2)} with bulk discounts!`
          : "Item added to cart"
      });
    } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  // Remove all items from a specific store in cart
const removeStoreFromCart = async (req, res) => {
  try {
    const { storeId } = req.body;
    const userId = req.user._id;
    console.log(storeId,"and the",userId);

    const cart = await Cart.findOneAndDelete({ userId, storeId });

    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: "No cart found for this store" 
      });
    }

    // Return updated combined cart
    const updatedCarts = await Cart.find({ userId })
      .populate({
        path: "items.productId",
        model: "Product",
      })
      .populate({
        path: "storeId",
        model: "Store",
      });

    const combinedItems = updatedCarts.flatMap(cart => 
      cart.items.map(item => ({
        ...item.toObject(),
        productId: item.productId._id,
        productDetails: item.productId,
        storeId: cart.storeId._id,
        storeDetails: cart.storeId
      }))
    );

    const totalPrice = updatedCarts.reduce((sum, cart) => sum + cart.totalPrice, 0);
    const totalSavings = updatedCarts.reduce((sum, cart) => sum + (cart.totalSavings || 0), 0);

    res.status(200).json({
      success: true,
      cart: {
        _id: "combined_cart",
        userId,
        items: combinedItems,
        totalPrice,
        totalSavings
      },
      message: "Store items removed from cart"
    });

  } catch (error) {
    console.error("Error removing store from cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

  module.exports = {
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    getCartStores,
    addToCart,
    removeStoreFromCart
  };