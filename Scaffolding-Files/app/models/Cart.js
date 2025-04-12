const db = require('../services/db');

const Cart = {
  getCartItems: async (userId) => {
    try {
        const query = `
            SELECT
                c.Cart_ID AS Cart_ID,
                c.Quantity,
                i.Inventory_ID AS orderId,
                i.Name AS name,
                i.Product_Image_Path AS image,
                i.Description AS description,
                i.Price AS price
            FROM Cart c
            JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID
            WHERE c.User_ID = ?
        `;
        console.log('SQL Query (getCartItems):', query, [userId]); // Log the query and parameters
        const [rows] = await db.query(query, [userId]);
        return { cartItems: Array.isArray(rows) ? rows : [] };
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
  },

    addToCart: async (userId, inventoryId, quantity = 1) => {
        try {
            await db.query(`
                INSERT INTO Cart (User_ID, Inventory_ID, Quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE Quantity = Quantity + ?
            `, [userId, inventoryId, quantity, quantity]);
            return true;
        } catch (err) {
            console.error('Error adding to cart:', err);
            return false;
        }
    },

    removeFromCart: async (userId, cartId) => {
        try {
            await db.query(`
                DELETE FROM Cart
                WHERE User_ID = ? AND Cart_ID = ?
            `, [userId, cartId]);
            return true;
        } catch (err) {
            console.error('Error removing from cart:', err);
            return false;
        }
    },

    clearCart: async (userId, connection) => {
        try {
            await connection.query('DELETE FROM Cart WHERE User_ID = ?', [userId]);
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    },

    getCartItemByUserAndInventory: async (userId, inventoryId) => {
        try {
            const [rows] = await db.query(`
                SELECT * FROM Cart
                WHERE User_ID = ? AND Inventory_ID = ?
            `, [userId, inventoryId]);
            if (Array.isArray(rows) && rows.length > 0) {
                return rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error checking existing cart item:', error);
            return null;
        }
    }
};

module.exports = Cart;