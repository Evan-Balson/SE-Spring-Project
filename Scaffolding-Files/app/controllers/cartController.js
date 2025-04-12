const Cart = require("../models/Cart");

// View cart
const viewCart = async (req, res) => {
    try {
        const userId = req.session.activeUser?.userID;
        console.log('User ID in viewCart:', userId);

        if (!userId) {
            return res.render("cart", {
                title: 'My Cart',
                cartItems: [],
                total: 0,
                errorMessage: 'User not logged in.'
            });
        }

        const { cartItems } = await Cart.getCartItems(userId);
        console.log("Fetched cart items:", cartItems); // Log the fetched items

        const total = cartItems.reduce((sum, item) => sum + (item.price * item.Quantity), 0);

        return res.render("cart", {
            title: 'Your Cart',
            cartItems, // Pass the array directly
            total
        });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.render("cart", {
            title: 'My Cart',
            cartItems: [],
            total: 0,
            errorMessage: 'Failed to load cart items.'
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.session.activeUser?.userID;
        const cartId = req.params.cartId;

        if (!userId || !cartId) {
            return res.status(400).json({
                success: false,
                message: 'Missing user ID or cart ID.'
            });
        }

        const result = await Cart.removeFromCart(userId, cartId);

        if (result) {
            return res.redirect('/cart');
        } else {
            return res.status(500).json({ success: false, message: 'Failed to remove item from cart.' });
        }
    } catch (error) {
        console.error('Error removing cart item:', error);
        return res.status(500).json({ success: false, message: 'Error removing item.', error: error.message });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    const { inventoryId, quantity } = req.body;
    const userId = req.session.activeUser?.userID;

    if (!userId || !inventoryId) {
        const errorMessage = !userId && !inventoryId
            ? 'User ID and Inventory ID are missing.'
            : !userId
                ? 'User ID is missing or user is not logged in.'
                : 'Inventory ID is missing.';
        return res.status(400).json({ success: false, message: errorMessage });
    }

    try {
        const existingCartItem = await Cart.getCartItemByUserAndInventory(userId, inventoryId);

        const itemQuantity = parseInt(quantity, 10) || 1;

        const result = await Cart.addToCart(userId, inventoryId, itemQuantity);
        if (result) {
            return res.status(200).json({ success: true, message: 'Item added to cart successfully.' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ success: false, message: 'Error adding item.', error: error.message });
    }
};

module.exports = {
    viewCart,
    removeFromCart,
    addToCart
};