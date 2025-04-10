const db = require('../services/db');
const { Cart } = require('../models/Cart');
const { Transaction } = require('../models/Transaction');
confirmDeliveryPage: async (req, res) => {
    try {
        const transactionId = req.session.transactionId;
        const userId = req.session.activeUser?.userID;

        if (!transactionId || !userId) return res.redirect('/checkout');

        // Get cart items and ensure values are numeric
        const cartItems = req.session.cartItems || [];
        let deliveryCost = parseFloat(req.session.deliveryCost || 5);  // Ensure deliveryCost is a number
        let totalAmount = parseFloat(req.session.totalAmount);  // Ensure totalAmount is a number
        let subtotal = parseFloat(req.session.subtotal);  // Ensure subtotal is a number

        // Log the values to check their types
        console.log("Delivery Cost:", deliveryCost);  // Should be a number
        console.log("Total Amount:", totalAmount);  // Should be a number
        console.log("Subtotal:", subtotal);  // Should be a number

        // Handle case where one or more values may be NaN or invalid
        if (isNaN(deliveryCost)) deliveryCost = 0;
        if (isNaN(totalAmount)) totalAmount = 0;
        if (isNaN(subtotal)) subtotal = 0;

        res.render('delivery', {
            title: 'Confirm Delivery',
            transactionId,
            cartItems,
            deliveryCost,
            totalAmount,
            subtotal,
        });
    } catch (error) {
        console.error('Error showing delivery page:', error);
        res.status(500).send('Internal server error.');
    }
}