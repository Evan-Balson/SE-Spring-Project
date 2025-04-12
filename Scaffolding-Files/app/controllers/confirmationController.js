const Transaction = require('../models/Transaction');
const OrderItem = require('../models/OrderItem');

const confirmationController = {
    viewConfirmationPage: async (req, res) => {
        try {
            const confirmationData = req.session.confirmationData;

            if (!confirmationData || !confirmationData.transactionId) {
                return res.redirect('/checkout'); // Redirect if no confirmation data
            }

            const transactionDetails = await Transaction.getTransactionDetails(confirmationData.transactionId);
            const orderItems = await OrderItem.getOrderItemsByTransactionId(confirmationData.transactionId);

            if (!transactionDetails) {
                return res.redirect('/checkout'); // Redirect if transaction details not found
            }

            res.render('confirmation', {
                title: 'Order Confirmation',
                transaction: transactionDetails,
                orderItems: orderItems,
                deliveryAddress: confirmationData.deliveryAddress,
                deliveryOption: confirmationData.deliveryOption,
                orderDate: confirmationData.orderDate
            });

            // Optionally clear the confirmation data from the session after displaying
            delete req.session.confirmationData;

        } catch (error) {
            console.error('Error viewing confirmation page:', error);
            res.status(500).send('Internal server error.');
        }
    }
};

module.exports = confirmationController;