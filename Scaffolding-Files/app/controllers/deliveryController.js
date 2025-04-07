const db = require('../services/db');
const { Cart } = require('../models/Cart');

const deliveryController = {
  addDelivery: async (req, res) => {
    try {
        const { deliveryAddress, deliveryOption, deliveryDate } = req.body;
        const transactionId = req.session.transactionId;
        const userId = req.session.activeUser?.userID;

        if (!transactionId || !deliveryAddress || !deliveryOption || !deliveryDate) {
            return res.status(400).send('Missing required delivery details.');
        }

        const cartData = await Cart.getCartItems(userId);
        if (!cartData || !Array.isArray(cartData.cartItems) || cartData.cartItems.length === 0) {
            return res.status(400).send('Cart is empty or invalid.');
        }

        let totalAmount = 0;
        cartData.cartItems.forEach(item => {
            totalAmount += parseFloat(item.price || 0);
        });

        const deliveryCost = 5.50;
        const subtotal = totalAmount; 
        const finalTotalAmount = subtotal + deliveryCost; 

        // Store as numbers to avoid issues in the view
        req.session.totalAmount = parseFloat(finalTotalAmount);
        req.session.subtotal = parseFloat(subtotal);
        req.session.deliveryCost = parseFloat(deliveryCost);
        req.session.cartItems = cartData.cartItems;

        const sql = `INSERT INTO Delivery (Delivery_Address, Delivery_Option, Delivery_Date, Transaction_ID) VALUES (?, ?, ?, ?)`;
        await db.query(sql, [deliveryAddress, deliveryOption, deliveryDate, transactionId]);

        res.redirect(`/payment/${transactionId}`);
    } catch (error) {
        console.error('Error adding delivery:', error);
        res.status(500).send('Could not add delivery.');
    }
},

confirmDeliveryPage: async (req, res) => {
    try {
        const transactionId = req.session.transactionId;
        const userId = req.session.activeUser?.userID;

        if (!transactionId || !userId) return res.redirect('/checkout');

        // Ensure values are numeric
        const cartItems = req.session.cartItems || [];
        let deliveryCost = parseFloat(req.session.deliveryCost || 5.58);  
        let totalAmount = parseFloat(req.session.totalAmount);  
        let subtotal = parseFloat(req.session.subtotal); 
        /*const deliveryCost = parseFloat(req.session.deliveryCost || 5.58); 
        const totalAmount = parseFloat(req.session.totalAmount); 
        const subtotal = parseFloat(req.session.subtotal); */

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
};

module.exports = deliveryController;