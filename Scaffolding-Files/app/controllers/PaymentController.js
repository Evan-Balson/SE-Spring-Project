const { Payment } = require('../models/Payment');
const { updatePaymentId } = require('../models/Transaction');

const paymentController = {
    processPayment: async (req, res) => {
        try {
            const { paymentType, transactionIds, userId, totalAmount } = req.body;

            if (totalAmount === 0){
                return res.json({message:"No Payment needed"});
            }

            if (!paymentType || !transactionIds || transactionIds.length === 0 || !userId || !totalAmount) {
                return res.status(400).json({ error: 'Payment type, transaction IDs, user ID, and total amount are required' });
            }

            const actualPaymentId = Payment.generatePaymentId();

            const payment = new Payment(paymentType, transactionIds[0], userId, totalAmount);

            const paymentResult = await payment.addPaymentMethod();
            if (!paymentResult || !paymentResult.payment_ID) {
                return res.status(500).json({ error: "Failed to add payment method to database" });
            }

            for (const transactionId of transactionIds) {
                await updatePaymentId(transactionId, actualPaymentId);
            }

            delete req.session.transactionIds;
            delete req.session.totalAmount;

            res.json({ message: 'Payment processed successfully', paymentId: actualPaymentId });
        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ error: 'Payment processing failed' });
        }
    },
    getPaymentDetails: async (req, res) => {
        try {
            res.status(501).json({ error: "Not implemented" });
        } catch (error) {
            console.error("Error getting payment details", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = paymentController;