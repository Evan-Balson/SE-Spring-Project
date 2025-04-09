
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
        const sql = "SELECT T.Inventory_ID AS inventoryID, I.Product_Image_Path AS image, I.Name AS itemName, T.Transaction_Date AS orderDate, T.Total_Price AS amount FROM Transaction T JOIN Inventory I ON T.Inventory_ID = I.Inventory_ID WHERE T.User_ID = ? ORDER BY T.Transaction_Date DESC LIMIT 3";
        const results = await db.query(sql, [userID]);
        return results;
      }
      

}

module.exports = {
    Transaction
}