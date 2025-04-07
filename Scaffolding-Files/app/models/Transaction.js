const db = require('../services/db');

class Transaction {
    constructor( Transaction_ID, Transaction_Date, Total_Price, User_ID, Inventory_ID, Payment_ID) {
        this.Transaction_ID = Transaction_ID;
        this.Transaction_Date = Transaction_Date;
        this.Total_Price = parseFloat(Total_Price).toFixed(2);
        this.User_ID = User_ID;
        this.Inventory_ID = Inventory_ID;
        this.Payment_ID = Payment_ID;
    }

    async newTransaction() {
        console.log("Payment_ID being inserted:", this.Payment_ID);
        console.log("TOTAL PRICE: ", this.Total_Price)
        const sql = `
            INSERT INTO Transaction (transaction_id, transaction_date, total_price, user_id, inventory_id, payment_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        const values = [this.Transaction_ID, this.Transaction_Date, this.Total_Price, this.User_ID, this.Inventory_ID, this.Payment_ID];
        try {
            const result = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error('Error creating transaction: ', error);
            throw error;
        }
    }
    async updatePaymentId(transactionId, paymentId) {
        const sql = `
            UPDATE Transaction
            SET Payment_ID = ?
            WHERE Transaction_ID = ?
        `;
        const values = [paymentId, transactionId];
    
        try {
            const [result] = await db.query(sql, values);
            return result;
        } catch (error) {
            console.error('Error updating Payment_ID:', error);
            throw error;
        }
    }
}

module.exports = { Transaction };