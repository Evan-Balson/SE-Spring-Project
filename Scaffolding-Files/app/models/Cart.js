const db = require('./../services/db');
const { Inventory } = require('./Inventory');

class Cart {
// Fetch cart items for a specific user and join with Inventory table
static async getCartItems(userId) {
  const sql = `
      SELECT 
          c.Cart_ID,
          c.Quantity,
          i.Inventory_ID AS orderId,
          i.Name AS name,
          i.Product_Image_Path AS image,
          i.Description AS description,
          i.Price AS price,
          t.Transaction_Date AS orderDate,
          d.Delivery_Date AS deliveryDate,
          d.Delivery_Address AS dispatchTo
      FROM Cart c
      JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID
      LEFT JOIN Transaction t ON t.Inventory_ID = i.Inventory_ID AND t.User_ID = c.User_ID
      LEFT JOIN Delivery d ON d.Transaction_ID = t.Transaction_ID
      WHERE c.User_ID = ?
      GROUP BY c.Cart_ID, i.Inventory_ID, t.Transaction_Date, d.Delivery_Date, d.Delivery_Address;
  `;

  try {
      const result = await db.query(sql, [userId]);

      // Filter out items with Quantity = 0
      const availableItems = result.filter(item => item.Quantity > 0);

      let totalPrice = 0;

      // Calculate the total price based on the number of available items
      availableItems.forEach(item => {
        const price = parseFloat(item.price);
        if (!isNaN(price)) {
            totalPrice += price;
        }
    });

      // Return the cart items and the total price
      return { cartItems: availableItems, totalPrice };
  } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
  }
}

  static async addToCart(userId, inventoryId, quantity=1) {
    const sql = `
        INSERT INTO Cart (User_ID, Inventory_ID, Quantity)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + ?;
    `;

    try {
      await db.query(sql, [userId, inventoryId, quantity, quantity]);
      return { success: true };
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }
  
  static async deleteCartItem(cartId) {
    const sql = 'DELETE FROM Cart WHERE Cart_ID = ?';
    try {
      await db.query(sql, [cartId]);
      return { success: true };
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }
}

module.exports = { Cart };