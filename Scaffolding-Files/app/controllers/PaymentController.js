const db = require('../services/db');
const { payment } = require('../models/payment');
const Transaction = require('../models/Transaction'); // Import the Transaction model
const { getCartItems } = require('../models/Cart');

const paymentController = {
    viewPaymentPage: async (req, res) => {
        try {
            const totalAmount = req.session.totalAmount || 0;
            res.render('payment', { title: 'Payment', totalAmount });
        } catch (error) {
            console.error('Error viewing payment page:', error);
            res.status(500).send('Internal server error.');
        }
    },

    processPayment: async (req, res) => {
        try {
            const { paymentType, transactionId, userId, totalAmount } = req.body;
            let paymentDetails = {};

            if (paymentType === 'card') {
                const { cardNumber, expiryMonth, expiryYear, cvv } = req.body;
                if (!/^\d+$/.test(cardNumber) || !/^\d{2}$/.test(expiryMonth) || !/^\d{2}$/.test(expiryYear) || !/^\d{3}$/.test(cvv)) {
                    return res.status(400).json({ error: 'Invalid card details.' });
                }
                paymentDetails = { cardNumber, expiryMonth, expiryYear, cvv };
            } else if (paymentType === 'bank') {
                const { accountNumber, sortCode } = req.body;
                if (!/^\d{8}$/.test(accountNumber) || !/^\d{6}$/.test(sortCode)) {
                    return res.status(400).json({ error: 'Invalid bank details.' });
                }
                paymentDetails = { accountNumber, sortCode };
            } else {
                return res.status(400).json({ error: 'Invalid payment type.' });
            }

            if (totalAmount === 0) {
                // No payment needed, proceed to confirmation
                req.session.confirmationData = { transactionId }; // Basic confirmation data
                return res.redirect('/payment-confirmation');
            }

            if (!paymentType || !transactionId || !userId || !totalAmount) {
                return res.status(400).json({ error: 'Payment type, transaction ID, user ID, and total amount are required' });
            }

            const connection = await db.getConnection();
            try {
                await connection.beginTransaction();

                // 1. Create a new payment record
                const paymentInstance = new payment(paymentType, userId, totalAmount);
                const paymentResult = await paymentInstance.addPaymentMethod(connection); // Pass connection

                if (!paymentResult || !paymentResult.payment_ID) {
                    await connection.rollback();
                    return res.status(500).json({ error: "Failed to add payment method to database" });
                }

                const actualPaymentId = paymentResult.payment_ID;

                // 2. Update the Payment_ID and Status in the associated transaction
                const transactionUpdateResult = await Transaction.prototype.updatePaymentId(transactionId, actualPaymentId, connection);

                if (!transactionUpdateResult) {
                    await connection.rollback();
                    return res.status(500).json({ error: "Failed to update transaction with payment information." });
                }

                // 3. Get cart items for order items
                const { cartItems } = await getCartItems(userId);

                // 4. Create separate order items linked to the transaction (assuming you have an OrderItem model)
                for (const item of cartItems) {
                    const sqlOrderItem = `
                        INSERT INTO OrderItem (transaction_id, inventory_id, quantity, price)
                        VALUES (?, ?, ?, ?)
                    `;
                    await connection.query(sqlOrderItem, [transactionId, item.orderId, item.Quantity, item.price]);
                }

                await connection.commit();

                // 5. Clear the cart
                await Cart.clearCart(userId, connection); // Implement clearCart in Cart model

                // 6. Prepare data for the confirmation page
                const transactionDetails = await Transaction.getTransactionDetails(transactionId);
                const confirmationData = {
                    ...transactionDetails,
                    items: cartItems,
                    deliveryAddress: req.session.deliveryAddress,
                    deliveryOption: req.session.deliveryOption,
                    orderDate: new Date().toLocaleDateString()
                };

                // 7. Save confirmation data to session
                req.session.confirmationData = confirmationData;

                // 8. Redirect to the confirmation page
                res.redirect('/payment-confirmation');

            } catch (error) {
                await connection.rollback();
                console.error('Error processing payment:', error);
                res.status(500).json({ error: 'Payment processing failed', details: error.message });
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Outer error in processPayment:', error);
            res.status(500).json({ error: 'Payment processing failed', details: error.message });
        }
    },
    getPaymentDetails: async (req, res) => {
        try {
            const { paymentId } = req.params;
            const paymentDetails = await payment.getPaymentById(paymentId);
            if (paymentDetails) {
                res.json(paymentDetails);
            } else {
                res.status(404).json({ error: 'Payment details not found' });
            }
        } catch (error) {
            console.error("Error getting payment details", error);
            res.status(500).json({ error: "Internal server error", details: error.message });
        }
    }
};

module.exports = paymentController;