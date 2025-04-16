const { Cart } = require("../models/Cart");

// View the user's cart
const viewCart = async (req, res) => {
    try {
        const userId = req.session.activeUser.userID;
        const cartItems = await Cart.getCartDetails(userId);
        console.log(cartItems);
        return res.render("cart", { title: 'My Cart', cartItems:cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        
    }
};

// Delete an item from the cart
const deleteCartItem = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await Cart.deleteCartItem(cartId);
        return res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);

    }
};

// Add an item to the cart
const addToCart = async (req, res) => {
    try {
      const userId = req.session.activeUser && req.session.activeUser.userID;
      // Using req.query if it's a GET request; or req.body if it's POST—adjust as needed.
      const inventoryId = req.query.inventoryId || req.body.inventoryId;
      // Parse quantity, defaulting to 1 if not provided or not a valid number.
      let quantity = req.query.quantity || req.body.quantity;
      quantity = parseInt(quantity, 10);
      if (isNaN(quantity)) {
        quantity = 1;
      }
  /*
      // Validate parameters:
      if (!userId) {
        return res.status(400).json({ message: "User ID is missing." });
      }
      if (!inventoryId) {
        return res.status(400).json({ message: "Inventory ID is missing." });
      }*/
  
      return await Cart.addToCart(userId, inventoryId, quantity);
      //res.send("Added to cart");
      /*
      if(result.success) {
        return res.status(200).json({ message: 'Item added to cart successfully.' });
      } else {
        return res.status(400).json({ message: 'Failed to add item to cart.' });
      }*/
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return res.status(500).json({
        message: 'Failed to add item to cart.',
        error: error.message
      });
    }
  };

module.exports = {
    viewCart,
    deleteCartItem,
    addToCart
};
