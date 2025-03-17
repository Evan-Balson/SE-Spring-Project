const db = require ('./db')

const checkoutController = {
    getCheckout: async (req, res) => {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.redirect('/login');
            }
            // Fetch cart items for the checkout page from the database
            const query = `
            SELECT
              Outfit.outfit_name AS name,
              Outfit.outfit_description AS description,
              Inventory.price AS penalty,
              Delivery.delivery_date AS deliveryDate,
              Transaction.transaction_date AS orderDate,
              Delivery.delivery_address AS dispatchTo,
              Outfit.outfit_id,
              Outfit.image_path AS image
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
          const cartItems = await db.query(query, [userId, userId]);

          const cartItemsWithQuantity = cartItems.map(item => ({
            ...item,
            quantity: 1,
            image: item.image || '/images/sample.jpg'
          }));
          res.render('checkout', {cartItems: cartItemsWithQuantity});
    
        } catch (error) {
            console.error('Error fetching checkout items: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    processCheckout: async (req, res) => {
        try {
            const userId = req.session.userId;
            if(!userId) {
                return res.redirect('/login');
            }
            res.send('Checkout processed successfully!');
        } catch (error) {
            console.error('Error processing checkout:', error);
            res.status(500).send('Internal Server Error');
        }
    },
     
};
module.exports = checkoutController;