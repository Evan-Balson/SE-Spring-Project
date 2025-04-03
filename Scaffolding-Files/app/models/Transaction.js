
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

}

module.exports = {
    Transaction
}