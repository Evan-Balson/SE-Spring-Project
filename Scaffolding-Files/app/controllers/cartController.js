// controllers/cartController.js
const db = require('../services/db');
const { Cart } = require('../models/Cart');
exports.viewCart = async (req, res) => {
    try {
        console.log("addToCart called");
        console.log("req.session.activeUser:", req.session.activeUser);
        console.log("req.query.inventoryId:", req.query.inventoryId);
        
        const userId = req.session.activeUser?.userID;
        if (!userId) return res.redirect('/login');

        // Fetch the cart items for the user
        const { cartItems, totalPrice } = await Cart.getCartItems(userId);
        console.log('Cart items:', cartItems); // Log to check data

        const inventoryId = cartItems.map(item => item.orderId);
        console.log('INVENTORY ID: ', inventoryId);

        // Pass the data to the template
        res.render('cart', {
            title: 'My Cart',
            cartItems: cartItems,
            totalAmount: totalPrice,
            inventoryId: inventoryId
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        await Cart.deleteCartItem(cartId);
        res.redirect('/cart');
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).send('An error occurred while deleting the cart item.');
    }
};

exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.activeUser?.userID;  // Check if user is logged in
        if (!userId) {
            return res.status(401).json({ message: 'User is not logged in.' });
        }
        const { inventoryId, quantity } = req.body;
        if (!inventoryId || !quantity) {
            return res.status(400).json({ message: 'Missing inventoryId or quantity.' });
        }
        await Cart.addToCart(userId, inventoryId, quantity);
        res.status(200).json({ message: 'Item added to cart successfully.' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart.', error: error.message });
    }
};