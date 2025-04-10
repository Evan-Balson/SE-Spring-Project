const  Cart  = require("../models/Cart");
console.log("Imported Cart object:", Cart);

exports.viewCart = async (req, res) => {
    console.log("Viewing Cart - Session:", req.session.activeUser);
    try {
        const userId = req.session.activeUser.userID;
        console.log("Viewing Cart - User ID:", userId); // Added log
        const cartItems = await Cart.getCartItems(userId);
        console.log("Viewing Cart - Cart Items:", cartItems); // Added log

        // Calculate the total price for the entire cart
        //const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.Quantity), 0);


        res.render("cart", { title: 'My Cart', cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'An error occurred while fetching your cart items.' });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await Cart.deleteCartItem(cartId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'An error occurred while deleting the cart item.' });
    }
};

exports.addToCart = async (req, res) => {
    const { inventoryId, quantity } = req.body;
    const userId = req.session.activeUser?.userID;

    // Check for undefined values
    if (!userId || !inventoryId) {
        let errorMessage = '';
        if (!userId && !inventoryId) {
            errorMessage = 'User ID and Inventory ID are missing.';
        } else if (!userId) {
            errorMessage = 'User ID is missing or user is not logged in.';
        } else {
            errorMessage = 'Inventory ID is missing.';
        }
        return res.status(400).json({ success: false, message: errorMessage });
    }

    try {
        // Check if the item is already in the cart for the user
        const existingCartItem = await Cart.getCartItemByUserAndInventory(userId, inventoryId);

        if (existingCartItem) {
            return res.status(409).json({ success: false, message: 'Item is already in your cart.' });
        }

        // Default quantity to 1 if not provided in the request body
        const itemQuantity = parseInt(quantity) || 1;

        // Add the item to the cart
        await Cart.addToCart(userId, inventoryId, itemQuantity);
        res.status(200).json({ success: true, message: 'Item added to cart successfully.' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add item to cart.', error: error.message });
    }
};

module.exports = exports;