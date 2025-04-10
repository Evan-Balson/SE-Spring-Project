const db = require('./../services/db');
const { Inventory } = require('./Inventory');

class Cart {
  static async getCartItems(userId) {
    const sql = `
        SELECT
            c.Cart_ID,
            c.Quantity,
            i.Inventory_ID AS orderId,
            i.Name AS name,
            i.Product_Image_Path AS image, -- Changed to 'image'
            i.Description AS description,
            i.Price AS price
        FROM Cart c
        JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID
        WHERE c.User_ID = ?
    `;
    try {
        const [rows] = await db.query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
}

    static async deleteCartItem(cartId) {
        const sql = 'DELETE FROM Cart WHERE Cart_ID = ?';
        try {
            await db.query(sql, [cartId]);
        } catch (error) {
            console.error('Error deleting cart item:', error);
            throw error;
        }
    }

    static async getCartItemByUserAndInventory(userId, inventoryId) {
      const sql = 'SELECT * FROM Cart WHERE User_ID = ? AND Inventory_ID = ?';
      try {
          const [rows] = await db.query(sql, [userId, inventoryId]);
          if (rows && rows.length > 0) {
              return rows[0];
          } else {
              return null;
          }
      } catch (error) {
          console.error('Error fetching cart item by user and inventory:', error);
          throw error;
      }
  }

    static async addToCart(userId, inventoryId, quantity) {
        const sql = 'INSERT INTO Cart (User_ID, Inventory_ID, Quantity) VALUES (?, ?, ?)';
        try {
            await db.query(sql, [userId, inventoryId, quantity]);
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw error;
        }
    }

    static async getCartItemById(cartId) {
        const sql = 'SELECT * FROM Cart WHERE Cart_ID = ?';
        try {
            const [rows] = await db.query(sql, [cartId]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching cart item by ID:', error);
            throw error;
        }
    }

    static async decrementQuantity(cartId) {
        const sql = 'UPDATE Cart SET Quantity = Quantity - 1 WHERE Cart_ID = ? AND Quantity > 0';
        try {
            await db.query(sql, [cartId]);
        } catch (error) {
            console.error('Error decrementing cart item quantity:', error);
            throw error;
        }
    }
}

module.exports = Cart;