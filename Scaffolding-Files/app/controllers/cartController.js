// controllers/cartController.js
const { Cart } = require("../models/Cart");

exports.viewCart = async (req, res) => {
    try {
        // Get the user ID from the active user session
        const userId = req.session.activeUser.userID;

        // Fetch cart items for the logged-in user
        const cartItems = await Cart.getCartItems(userId);
        
        return cartItems;
        
    } catch (error) {
        // Log and send error message
        console.error('Error fetching cart items:', error);
        res.status(500).render("error", { message: 'An error occurred while fetching your cart items.' });
    }
};
exports.deleteCartItem = async (req, res) => {
    try {
        // Get the cart item ID from the request parameters
        const cartId = req.params.cartId;

        // Delete the cart item using the Cart model
        await Cart.deleteCartItem(cartId);

        // Redirect to the cart page after deletion
        res.redirect('/cart');
    } catch (error) {
        // Log and send error message
        console.error('Error deleting cart item:', error);
        res.status(500).render("error", { message: 'An error occurred while deleting the cart item.' });
    }
};