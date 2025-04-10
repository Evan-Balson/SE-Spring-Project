const db = require('../services/db')
const {Cart} = require ('../models/Cart');

// checkoutController.js
const checkoutController = {
    getCheckout: async (req, res) => {
        try {
            const userId = req.session.activeUser.userID;
            console.log("Checkout User ID:", userId); // Add this line
            console.log("Session Data: ", req.session); //Add this line

            if (!userId) {
                return res.redirect('/login');
            }
            const cartItems = await Cart.getCartItems(userId);
            console.log("Checkout Cart Items: ", cartItems); // add this line.
            res.render('checkout', { title: 'Checkout', cartItems });
        } catch (error) {
            console.error('Error fetching checkout items: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    processCheckout: async (req, res) => {
        try {
            const userId = req.session.activeUser.userID;
            if(!userId) {
                return res.redirect('/login');
            }
            res.send('Checkout processed successfully!');
        } catch (error) {
            console.error('Error processing checkout:', error);
            res.status(500).send('Internal Server Error');
        }
    },
     
};
module.exports = checkoutController;