
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Transaction {

    // Attributes
    transaction_ID;
    transaction_date;
    total;
    user_id;


    // Constructor
    constructor(transactionId, date, totalPrice, userID){
        this.transaction_ID = transactionId;
        this.transaction_date = date;
        this.total = totalPrice;
        this.user_id = userID;
    }

    // methods
    async newTransaction() {
        try {
            // insert into transaction table
            const transactionSQL =
            `INSERT INTO Transaction (
                transaction_id,
                transaction_date,
                total,
                user_id)
            VALUES (?, ?, ?, ?)`;

            var result = await db.query(transactionSQL, [this.transactionID, this.date, this.totalPrice, this.userID]);

            return result;
    
        } catch (error) {
            console.error("Error adding transaction to database:", error);
            throw error;
        }
    }

    async checkInventory(){
        try {
            // no inventory linked in database code - but in ERD deliberate or ??
        } catch (error) {
            console.error("Error checking inventory:", error);
            throw error;
        }
    }

    static async getRecentTransactions(userID) {
      console.log(userID);
        try {
            // SQL query to get the most recent 3 transactions for the given userID
            const sql = "SELECT T.Inventory_ID AS inventoryID, I.Product_Image_Path AS image, I.Name AS itemName, T.Transaction_Date AS orderDate, T.Total_Price AS amount FROM Transaction T JOIN Inventory I ON T.Inventory_ID = I.Inventory_ID WHERE T.User_ID = ? ORDER BY T.Transaction_Date DESC LIMIT 3";
            
            // Execute the query
            const results = await db.query(sql, [userID]);
            
            // Return the query results
            return results;
          } catch (error) {
            // Handle and log errors if the query fails
            console.error("Error fetching recent transactions:", error);
            throw new Error('Unable to fetch recent transactions');
          }
        }

    // Function to get recent transactions for a user by their userID
  static async getTransactions(userID) {
    console.log(userID);
    try {
       // SQL query to get all transactions for the given userID
       const sql = "SELECT T.Inventory_ID AS inventoryID, I.Product_Image_Path AS image, I.Name AS itemName, T.Transaction_Date AS orderDate, T.Total_Price AS amount FROM Transaction T JOIN Inventory I ON T.Inventory_ID = I.Inventory_ID WHERE T.User_ID = ? ORDER BY T.Transaction_Date DESC";
      
      // Execute the query
      const results = await db.query(sql, [userID]);
      
      // Return the query results
      return results;
    } catch (error) {
      // Handle and log errors if the query fails
      console.error("Error fetching recent transactions:", error);
      throw new Error('Unable to fetch recent transactions');
    }
  }


  static async getAllTransactions(userID) {
    console.log(userID);
    const query = `SELECT t.Transaction_ID, t.Transaction_Date AS orderDate, i.Name AS itemName, i.Description AS description, i.Product_Image_Path AS image, d.Delivery_Address AS dispatchTo, t.Total_Price AS penalty FROM Transaction t JOIN Inventory i ON t.Inventory_ID = i.Inventory_ID LEFT JOIN Delivery d ON t.Transaction_ID = d.Transaction_ID WHERE t.User_ID = ? ORDER BY t.Transaction_Date DESC;`;


    const results = await db.query(query, [userID]);
    console.log(results);
    return results;
  }

  static async searchTransactions(userID, sortOrder, searchString) {
    if (sortOrder === '*') {
      const defaultMonths = 12;
      const query = `SELECT t.Transaction_ID, t.Transaction_Date AS orderDate, i.Name AS itemName, i.Description AS description, i.Product_Image_Path AS image, d.Delivery_Address AS dispatchTo, t.Total_Price AS penalty FROM Transaction t JOIN Inventory i ON t.Inventory_ID = i.Inventory_ID LEFT JOIN Delivery d ON t.Transaction_ID = d.Transaction_ID WHERE t.User_ID = ? ORDER BY t.Transaction_Date DESC;`;

      const results = await db.query(query, [userID, defaultMonths]);
      return results;
    }

    const months = parseInt(sortOrder, 10) || 12;
    const likeString = `%${searchString.trim()}%`;
    const query = `SELECT DISTINCT t.Transaction_ID, t.Transaction_Date AS orderDate, i.Name AS itemName, i.Description AS description, i.Product_Image_Path AS image, d.Delivery_Address AS dispatchTo, t.Total_Price AS penalty FROM Transaction t JOIN Inventory i ON t.Inventory_ID = i.Inventory_ID LEFT JOIN Delivery d ON t.Transaction_ID = d.Transaction_ID LEFT JOIN Outfit_and_Categories oc ON i.Inventory_ID = oc.Inventory_ID LEFT JOIN Category c ON oc.Category_ID = c.Category_ID WHERE t.User_ID = ? AND t.Transaction_Date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH) AND (i.Description LIKE ? OR c.Category_Name LIKE ?) ORDER BY t.Transaction_Date DESC;`;

    const results = await db.query(query, [userID, months, likeString, likeString]);
    return results;
  }
}


module.exports = {
    Transaction
}