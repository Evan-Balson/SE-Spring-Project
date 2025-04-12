const { Cart } = require("../models/Cart");

// View the user's cart
const viewCart = async (req, res) => {
    try {
        const userId = req.session.activeUser.userID;
        const cartItems = await Cart.getCartItems(userId);
        return res.render("cart", { title: 'My Cart', cartItems });
    } catch (error) {
        console.error('Error fetching cart items:', error);
        return res.status(500).render("error", {
            message: 'An error occurred while fetching your cart items.'
        });
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
        return res.status(500).render("error", {
            message: 'An error occurred while deleting the cart item.'
        });
    }
};

// Add an item to the cart
const addToCart = async (req, res) => {
    try {
        const userId = req.session.activeUser.userID;
        const { inventoryId, quantity } = req.body;
        await Cart.addToCart(userId, inventoryId, quantity);
        toastr.success("Item successfully added to cart");
        return res.status(200).json({ message: 'Item added to cart successfully.' });
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
