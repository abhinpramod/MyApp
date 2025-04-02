const Product = require('../model/products.model');
const Cart = require('../model/cart');
const user = require('../model/user.model');
const store = require('../model/store.model');




const addToCart = async (req, res) => {
  try {
    const {  storeId, productId, quantity } = req.body;
     const userId = req.user._id    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId, storeId });

    if (cart) {
      // Check if product already exists in cart
      const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

      if (itemIndex > -1) {
        // If exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Else, add new product
        cart.items.push({
          productId,
          quantity,
          basePrice: product.basePrice,
        });
      }
    } else {
      // If no cart exists, create new cart
      cart = new Cart({
        userId,
        storeId,
        items: [{ productId, quantity, basePrice: product.basePrice }],
      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.basePrice, 0);

    await cart.save();
    res.status(200).json({ success: true, cart });

  } catch (error) {
    console.error("error from addToCart",error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addToCart };
