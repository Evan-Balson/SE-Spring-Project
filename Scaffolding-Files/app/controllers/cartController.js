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