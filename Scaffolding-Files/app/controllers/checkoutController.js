const db = require('../services/db');
const Cart = require('../models/Cart');
const Transaction = require('../models/Transaction');

// Generate a clean transaction ID
const generateTransactionId = () => {
    const prefix = 'T';
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${random}`;
};

const checkoutController = {
    // Load checkout view
    getCheckout: async (req, res) => {
        try {
            const userId = req.session.activeUser?.userID;
            if (!userId) return res.redirect('/login');

            const { cartItems } = await Cart.getCartItems(userId);
            const itemsArray = Array.isArray(cartItems) ? cartItems : [];

            if (itemsArray.length === 0) return res.redirect('/cart');

            const total = itemsArray.reduce((sum, item) => sum + (item.price * item.Quantity), 0);

            const transactionId = generateTransactionId();
            const transactionDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            const transactionStatus = 'pending_payment';

            // Store in session (useful for delivery or payment steps)
            req.session.transaction = {
                transactionId,
                userId,
                transactionDate,
                totalPrice: total,
                cartItems: itemsArray,
                transactionStatus,
            };

            req.session.transactionId = transactionId;

            console.log("Checkout Session:", req.session.transaction);

            return res.render('checkout', {
                title: 'Checkout',
                cartItems: itemsArray,
                total,
            });
        } catch (error) {
            console.error('Error fetching checkout items:', error);
            return res.status(500).send('Internal Server Error');
        }
    },

    // Process checkout form
    processCheckout: async (req, res) => {
        const userId = req.session.activeUser?.userID;
        if (!userId) return res.status(400).send("Missing user session.");

        const transactionData = req.session.transaction;
        if (!transactionData) return res.status(400).send("Transaction data missing.");

        const { transactionId, transactionDate, totalPrice, cartItems, transactionStatus } = transactionData;

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert new transaction (main summary, not per item yet)
            const transaction = new Transaction(
                transactionId,
                transactionDate,
                totalPrice,
                userId,
                null, // Inventory ID not needed here
                null, // Payment ID will be added later
                transactionStatus
            );

            const transactionResult = await transaction.newTransaction(connection);

            if (!transactionResult) {
                await connection.rollback();
                return res.status(500).send('Failed to create initial transaction record.');
            }

            // Optional: Could store item-wise transactions here if needed
            // Loop cartItems if saving item-level logs in a junction table

            await connection.commit();

            req.session.transactionId = transactionId;
            req.session.userId = userId;

            console.log("Initial transaction record created. ID saved to session:", transactionId);
            return res.redirect('/delivery');
        } catch (error) {
            await connection.rollback();
            console.error('Error during initial checkout process:', error);
            return res.status(500).send('Checkout failed. Please try again.');
        } finally {
            connection.release();
        }
    },
};

module.exports = checkoutController;