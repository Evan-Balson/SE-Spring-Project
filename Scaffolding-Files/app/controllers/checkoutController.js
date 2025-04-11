const { Cart } = require('../models/Cart');

const getCheckout = async (req, res) => {
    try {
        // Check if activeUser exists in the session
        if (!req.session.activeUser || !req.session.activeUser.userID) {
            return res.redirect('/login');
        }

        const userId = req.session.activeUser.userID;
        console.log("Checkout User ID:", userId);
        console.log("Session Data:", req.session);

        // Fetch cart items for the user
        const cartItems = await Cart.getCartItems(userId);
        console.log("Checkout Cart Items:", cartItems);

        return res.render('checkout', { title: 'Checkout', cartItems });
    } catch (error) {
        console.error('Error fetching checkout items:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const processCheckout = async (req, res) => {
    try {
        // Check if activeUser exists in the session
        if (!req.session.activeUser || !req.session.activeUser.userID) {
            return res.redirect('/login');
        }

        const userId = req.session.activeUser.userID;
        // Placeholder: Add logic for processing payment, saving order, etc.

        return res.send('Checkout processed successfully!');
    } catch (error) {
        console.error('Error processing checkout:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getCheckout,
    processCheckout
};
