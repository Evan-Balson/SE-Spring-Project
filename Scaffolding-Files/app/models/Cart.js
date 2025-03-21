const db = require('./../services/db');

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
        t.Transaction_Date AS orderDate,
        d.Delivery_Date AS deliveryDate,
        -- Assuming penalty info is in Transaction or Delivery table (adjust accordingly)
        (SELECT SUM(t.Total_Price) * 0.1 FROM Transaction t WHERE t.User_ID = c.User_ID AND t.Inventory_ID = c.Inventory_ID) AS penalty, 
        d.Delivery_Address AS dispatchTo
      FROM Cart c
      JOIN Inventory i ON c.Inventory_ID = i.Inventory_ID
      LEFT JOIN Transaction t ON t.Inventory_ID = i.Inventory_ID AND t.User_ID = c.User_ID
      LEFT JOIN Delivery d ON d.Transaction_ID = t.Transaction_ID
      WHERE c.User_ID = ?
    `;

    try {
      const result = await db.query(sql, [userId]);
      return result;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }
}

module.exports = {Cart};
