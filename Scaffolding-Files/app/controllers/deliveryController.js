const db = require('../services/db');
const Cart = require('../models/Cart');
const Delivery = require('../models/Delivery'); // Assuming this model has static methods

const DeliveryController = {
    viewDeliveryPage: async (req, res) => {
        try {
            const transactionId = req.session.transactionId;
            const userId = req.session.activeUser?.userID;

            if (!transactionId || !userId) {
                return res.redirect('/checkout');
            }

            const [deliveryInfo] = await db.query(
                'SELECT Delivery_Address, Delivery_Option, Delivery_Date FROM Delivery WHERE Transaction_ID = ?',
                [transactionId]
            );

            const deliveryDetails = deliveryInfo?.[0] || {};

            res.render('delivery', {
                title: 'Delivery Details',
                transactionId,
                deliveryAddress: req.session.deliveryAddress || deliveryDetails.Delivery_Address || '',
                deliveryOption: req.session.deliveryOption || deliveryDetails.Delivery_Option || '',
                deliveryDate: req.session.deliveryDate || deliveryDetails.Delivery_Date || '',
                subtotal: req.session.subtotal || 0,
                deliveryCost: req.session.deliveryCost || 0,
                totalAmount: req.session.totalAmount || 0,
                showConfirmation: req.session.showDeliveryConfirmation || false // Flag to show confirmation
            });
        } catch (error) {
            console.error('Error viewing delivery page:', error);
            res.status(500).send('Internal server error.');
        }
    },

    addDelivery: async (req, res) => {
        try {
            const { addressLine1, addressLine2, city, postcode, country, email, phone, deliveryOption, deliveryDate } = req.body;
            const transactionId = req.session.transactionId;
            const userId = req.session.activeUser?.userID;

            if (!transactionId || !addressLine1 || !city || !postcode || !country || !deliveryOption) {
                return res.status(400).send('Missing required delivery details.');
            }

            if (Delivery && Delivery.validatePostcode && !Delivery.validatePostcode(postcode)) {
                return res.status(400).send('Invalid UK postcode.');
            }

            const deliveryAddress = `${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${postcode}, ${country}`;

            const { cartItems } = await Cart.getCartItems(userId);
            if (!cartItems || cartItems.length === 0) {
                return res.status(400).send('Cart is empty or invalid.');
            }

            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.Quantity), 0);
            const deliveryCost = Delivery && Delivery.getDeliveryCost ? Delivery.getDeliveryCost(deliveryOption) : 0; // Ensure Delivery and getDeliveryCost exist
            const totalAmount = subtotal + deliveryCost;

            req.session.deliveryAddress = deliveryAddress;
            req.session.deliveryOption = deliveryOption;
            req.session.deliveryDate = deliveryDate || new Date().toISOString().slice(0, 10);
            req.session.subtotal = parseFloat(subtotal.toFixed(2));
            req.session.deliveryCost = parseFloat(deliveryCost.toFixed(2));
            req.session.totalAmount = parseFloat(totalAmount.toFixed(2));
            req.session.cartItems = cartItems;
            req.session.showDeliveryConfirmation = true; // Set flag to show confirmation

            const [existing] = await db.query(
                'SELECT * FROM Delivery WHERE Transaction_ID = ?',
                [transactionId]
            );

            if (Array.isArray(existing) && existing.length === 0) {
                await db.query(
                    `INSERT INTO Delivery (Delivery_Address, Delivery_Option, Delivery_Date, Transaction_ID)
                     VALUES (?, ?, ?, ?)`,
                    [deliveryAddress, deliveryOption, deliveryDate, transactionId]
                );
            } else if (Array.isArray(existing) && existing.length > 0) {
                await db.query(
                    `UPDATE Delivery SET Delivery_Address = ?, Delivery_Option = ?, Delivery_Date = ?
                     WHERE Transaction_ID = ?`,
                    [deliveryAddress, deliveryOption, deliveryDate, transactionId]
                );
            } else {
                console.warn('Unexpected result from database query: ', existing);
                return res.status(500).send('Database error occurred.');
            }

            // Redirect back to the delivery page to show confirmation
            return res.redirect('/delivery');
        } catch (error) {
            console.error('Error adding delivery:', error);
            res.status(500).send('Could not add delivery.');
        }
    },

    confirmDelivery: async (req, res) => {
        try {
            // Once the user confirms, remove the confirmation flag from the session
            req.session.showDeliveryConfirmation = false;
            return res.redirect('/payment');
        } catch (error) {
            console.error('Error confirming delivery:', error);
            res.status(500).send('Internal server error.');
        }
    }
};

module.exports = DeliveryController;