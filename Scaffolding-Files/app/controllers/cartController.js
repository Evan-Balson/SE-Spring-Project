
const db = require ('./db');


const cartController = {
    getCart: async (req, res) => {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.redirect('/login');
            }

            const query = `
            Select
                Outfit.outfit_id,
                Outfit.outfit_name, 
                Outfit.outfit_description,
                Inventory.price,
                Outfit.outfit_color,
                Outfit.outfit_size
            FROM Outfit
            JOIN Inventory ON Outfit.outfit_id = Inventory.outfit_id
            JOIN Transaction ON Transaction.user_id = ?
            JOIN Delivery ON Delivery.transaction_id = Transaction.transaction_id
            WHERE Transaction.transaction_id IN (
                SELECT Transaction.transaction_id
                FROM Transaction
                JOIN Delivery ON Transaction.transaction_id = Delivery.transaction_id
                WHERE Transaction.user_id = ?
        )
        `;

        const cartItem = await db.query (query, [userId, userId]);

        res.render('cart', {cartItems: cartItem});

        } catch (error) {
            console.error('Error fetching cart: ', error);
            res.status(500).send('Internal Server Error');
        }
    },

    removeItem: async (req, res) => {
        try {
            const outfitId = req.params.outfitId;
            const userId = req.session.userId;

            if (!userId) {
                return res.redirect('/login');
            }

            // Logic to remove the item from cart in the database
            const deleteQuery = `
            DELETE Delivery, Transaction
            FROM Delivery
            JOIN Transaction ON Delivery.transaction_id = Transaction.transaction_id
            WHERE Transaction.user_id = ? AND Transaction.transaction_id IN (
                SELECT Transaction.transaction_id
                FROM Transaction
                JOIN Delivery ON Transaction.transaction_id = Delivery.transaction_id
                JOIN Outfit ON Outfit.outfit_id = ?
                JOIN Inventory ON Outfit.outfit_id = Inventory.outfit_id
            );
            `;
            await db.query(deleteQuery, [userId, outfitId]);
            res.redirect('/cart');

            } catch (error) {
                console.error('Error removing item:', error);
                res.status(500).send('Internal Server Error');
            }
        },
        orderDetails: async (req, res) => {
            try {
                const outfitId = req.params.outfitId;
                const userId = req.session.userId;

                if (!userId) {
                    return res.redirect('/login');
                }
                const query = `
                SELECT 
                    Outfit.outfit_id, 
                    Outfit.outfit_name, 
                    Outfit.outfit_description,
                    Inventory.price,
                    Outfit.outfit_color,
                    Outfit.outfit_size,
                    Users.user_address
                FROM Outfit
                JOIN Inventory ON Outfit.outfit_id = Inventory.outfit_id
                JOIN Users ON Users.user_id = ?
                JOIN Transaction ON Transaction.user_id = Users.user_id
                JOIN Delivery ON Delivery.transaction_id = Transaction.transaction_id
                WHERE Outfit.outfit_id = ?;
                
                `;
                const orderDetails = await db.query(query, [userId, outfitId]);

                if (orderDetails.length ===0) {
                    return res.status(404).send('Order details not found');
                }

                res.render('order-details', {orderDetails: orderDetails[0]});
            }catch (error) {
                console.error('Error fetching order details', error);
                res.status(500).send('Internal Server Error');
            }
        },
    };
module.exports = cartController;