const db = require('./services/db');
const { Transaction } = require('../models/Transaction'); // Assuming your Transaction model

const transactionController = {
    createTransaction: async (req, res) => {
        const { id, date, totalPrice, userId, inventoryId } = req.body;
        const paymentId = req.session.paymentId; // Retrieve Payment_ID from session

        if (!date || !totalPrice || !userId || !inventoryId || !paymentId) {
            return res.status(400).json({ error: 'Missing required fields or Payment ID.' });
        }

        if (typeof totalPrice !== 'number' || isNaN(totalPrice)) {
            return res.status(400).json({ error: 'Invalid total price' });
        }

        try {
            const formattedPrice = parseFloat(totalPrice.toFixed(2));

            const transaction = new Transaction(
                id,
                paymentId, // Use the Payment_ID from the paymentController
                date,
                formattedPrice,
                userId,
                inventoryId
            );

            await transaction.newTransaction();

            // Optionally clear the payment ID from the session after creating the transaction
            delete req.session.paymentId;
            req.session.transactionId = id; // Store transaction ID for confirmation

            res.status(201).json({
                message: 'Transaction created successfully.',
                transactionId: id,
            });
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ error: 'Failed to create transaction', details: error.message });
        }
    },
    confirmOrder: async (req, res) => {
        try {
            const transactionId = req.session.transactionId;
            if (!transactionId) {
                return res.redirect('/checkout'); // Redirect to checkout if no transaction ID is found
            }

            // Fetch the transaction details from the database
            const sql = `
                SELECT
                    t.Transaction_ID,
                    t.Transaction_Date,
                    t.Total_Price,
                    u.Name AS UserName,
                    i.Name AS ItemName,
                    p.Payment_ID,
                    p.Payment_Type
                FROM Transaction t
                JOIN User u ON t.User_ID = u.User_ID
                JOIN Inventory i ON t.Inventory_ID = i.Inventory_ID
                JOIN Payment p ON t.Payment_ID = p.Payment_ID
                WHERE t.Transaction_ID = ?
            `;
            const [transaction] = await db.query(sql, [transactionId]);

            if (!transaction || transaction.length === 0) {
                return res.render('confirmation', {
                    transaction: null, // No transaction found
                });
            }

            res.render('confirmation', {
                transaction: transaction[0], // Pass the transaction details to the template
            });
        } catch (error) {
            console.error('Error showing confirmation page:', error);
            res.status(500).send('Internal server error.');
        }
    },
};

module.exports = transactionController;