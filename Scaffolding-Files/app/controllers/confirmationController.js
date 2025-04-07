const db = require('../services/db');

const confirmationController = {
    confirmTransaction: async (req, res) => {
        try {
            const transactionId = req.params.transactionId;  // Get transaction ID from URL params

            // Check if the transaction ID exists in the database
            const sql = `SELECT * FROM Transaction WHERE Transaction_ID = ?`;
            const transaction = await db.query(sql, [transactionId]);

            if (!transaction || transaction.length === 0) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }

            // Assuming to have a Cart table or session for this user's cart, clear the cart.
            const userId = transaction[0].User_ID;  // Get the user ID associated with the transaction
            
            // Clear the cart items for the user (you could also use a `DELETE` SQL query to clear it)
            const deleteCartSQL = `DELETE FROM Cart WHERE User_ID = ?`;
            await db.query(deleteCartSQL, [userId]);

            // Render the confirmation page with transaction details
            res.render('confirmation', {
                title: 'Order Confirmation',
                transaction: transaction[0],  // Assuming 'transaction' is an array, getting the first record
                message: 'Your order has been successfully placed!'
            });
        } catch (error) {
            console.error('Error in confirmation:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = confirmationController;