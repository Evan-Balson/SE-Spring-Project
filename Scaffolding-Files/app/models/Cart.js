const db = require('./../services/db');
const { Inventory } = require('./Inventory');

class Cart {

  static async getCartDetails(userID) {
    const sql = "SELECT c.Cart_ID, c.Quantity, c.Inventory_ID AS orderId, i.Name AS name, i.Product_Image_Path AS image, i.Description, i.Price FROM Cart c JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID WHERE c.User_ID = ?;";
    try {
      const results = await db.query(sql, [userID]);
      return results;
    } catch (error) {
      console.error('Error fetching cart details:', error);
      throw error;
    }
  }

  static async getCheckoutDetails(userID) {
    const sql = `
      SELECT 
        c.Cart_ID,
        c.Quantity,
        c.Inventory_ID AS orderId,
        i.Name AS name,
        i.Product_Image_Path AS image,
        i.Description,
        i.Price,
        u.Address AS sellerAddress
      FROM Cart c
      JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID
      JOIN User u ON i.User_ID = u.User_ID
      WHERE c.User_ID = ?
    `;
    try {
      const results = await db.query(sql, [userID]);
      return results;
    } catch (error) {
      console.error('Error fetching checkout details:', error);
      throw error;
    }
  }

  static async deleteCartItem(cartId) {
    try {
      // Retrieve the current quantity for the given cart item.
      const selectSql = 'SELECT Quantity FROM Cart WHERE Cart_ID = ?';
      const rows = await db.query(selectSql, [cartId]);
      
      if (!rows.length) {
        return { success: false, message: "Cart item not found." };
      }
      
      const currentQty = rows[0].Quantity;
      
      if (currentQty > 1) {
        // Decrement the quantity by one.
        const updateSql = 'UPDATE Cart SET Quantity = Quantity - 1 WHERE Cart_ID = ?';
        await db.query(updateSql, [cartId]);
        return { success: true, message: "Cart item quantity decremented." };
      } else {
        // If quantity is 1, delete the row.
        const deleteSql = 'DELETE FROM Cart WHERE Cart_ID = ?';
        await db.query(deleteSql, [cartId]);
        return { success: true, message: "Cart item removed." };
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }
  
  static async addToCart(userId, inventoryId, quantity = 1) {
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
}

module.exports = {Cart};
