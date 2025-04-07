const db = require('../services/db');
const { Transaction } = require('../models/transaction');
const { Cart } = require('../models/Cart');

function generateTransactionId(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let transactionId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        transactionId += characters.charAt(randomIndex);
    }

    return transactionId;
}

const checkoutController = {
    processCheckout: async (req, res) => {
        try {
            const userId = req.session.activeUser?.userID;
            if (!userId) {
                return res.redirect('/login');
            }

            const cartData = await Cart.getCartItems(userId);
            console.log('Cart Data:', cartData);

            if (!cartData || !Array.isArray(cartData.cartItems) || cartData.cartItems.length === 0) {
                return res.status(400).send('Cart is empty or invalid');
            }

            // Group cart items by `orderId` to ensure uniqueness
            const groupedItems = cartData.cartItems.reduce((acc, item) => {
                const existingItem = acc.find(i => i.orderId === item.orderId);
                if (!existingItem) {
                    acc.push({ ...item }); 
                }
                return acc;
            }, []);

            console.log("Grouped Items:", groupedItems);

            let totalPrice = 0;
            const transactionID = generateTransactionId();
            const date = new Date().toISOString().slice(0, 10);
            const initialPaymentId = 1;

            // Calculate total price from distinct grouped items
            groupedItems.forEach(item => {
                const itemPrice = parseFloat(item.price || 0);
                if (!isNaN(itemPrice)) {
                    totalPrice += itemPrice;
                }
            });

            // Create transaction entries per item
            for (const item of groupedItems) {
                const transaction = new Transaction(
                    transactionID,
                    date,
                    item.price,
                    userId,
                    item.orderId,
                    initialPaymentId
                );
                await transaction.newTransaction();
            }

            // Store in session for reuse during delivery
            req.session.totalAmount = totalPrice;
            req.session.subtotal = totalPrice; 
            req.session.transactionId = transactionID;
            req.session.cartItems = groupedItems;

            console.log('Cart IDs in Cart:', cartData.cartItems.map(i => i.Cart_ID));

            res.render('checkout', {
                title: 'Checkout',
                cartItems: groupedItems,
                totalAmount: totalPrice,
                transactionId: transactionID,
            });
        } catch (error) {
            console.error('Error processing checkout:', error);
            res.status(500).send('Internal Server Error');
        }
    },
};

module.exports = checkoutController;