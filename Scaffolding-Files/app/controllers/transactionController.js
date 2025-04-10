


const { Transaction } = require('../models/transaction');


const transactionController = {
    createTransaction: async (req, res) => {
        const { id,date, totalPrice, userId, inventoryId, paymentId } = req.body;

        if (!date || !totalPrice || !userId || !inventoryId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (typeof totalPrice !== 'number' || isNaN(totalPrice)) {
            return res.status(400).json({ error: 'Invalid total price' });
        }

        try {
            const formattedPrice = parseFloat(totalPrice.toFixed(2));

            const transaction = new Transaction(
                id,
                date,
                formattedPrice,
                userId,
                inventoryId,
                paymentId
            );

            await transaction.newTransaction();

            res.status(201).json({
                message: 'Transaction created successfully',
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
          const sql = `SELECT * FROM Transactions WHERE Transaction_ID = ?`;
          const [transaction] = await db.query(sql, [transactionId]);

          if (!transaction) {
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