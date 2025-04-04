// controllers/cartController.js
const { Cart } = require("../models/Cart");

exports.viewCart = async (req, res) => {
    try {
        const userId = req.session.activeUser.userID;
        const cartItems = await Cart.getCartItems(userId);
        res.render("cart", { title: 'My Cart', cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).render("error", { message: 'An error occurred while fetching your cart items.' });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await Cart.deleteCartItem(cartId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).render("error", { message: 'An error occurred while deleting the cart item.' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.activeUser.userID;
        const { inventoryId, quantity } = req.body;
        await Cart.addToCart(userId, inventoryId, quantity);
        res.status(200).json({ message: 'Item added to cart successfully.' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart.', error: error.message });
    }
};