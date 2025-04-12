const db = require('../services/db');

class Transaction {
    constructor(Transaction_ID, Transaction_Date, Total_Price, User_ID, Inventory_ID, Payment_ID, Status = 'pending') {
        this.Transaction_ID = Transaction_ID;
        this.Transaction_Date = Transaction_Date;
        this.Total_Price = parseFloat(Total_Price).toFixed(2);
        this.User_ID = User_ID;
        this.Inventory_ID = Inventory_ID; // Will be null for main transaction
        this.Payment_ID = Payment_ID;     // Will be updated later
        this.Status = Status;
    }

    async newTransaction(connection) {
        console.log("Payment_ID being inserted:", this.Payment_ID);
        console.log("TOTAL PRICE: ", this.Total_Price);
        console.log("Transaction Status:", this.Status);
        const sql = `
            INSERT INTO Transaction (transaction_id, transaction_date, total_price, user_id, payment_id, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [this.Transaction_ID, this.Transaction_Date, this.Total_Price, this.User_ID, this.Payment_ID, this.Status];
        try {
            const [result] = await connection.query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error creating transaction: ', error);
            throw error;
        }
    }

    async updatePaymentId(transactionId, paymentId, connection) {
        const sql = `
            UPDATE Transaction
            SET Payment_ID = ?, Status = 'processing'
            WHERE Transaction_ID = ?
        `;
        const values = [paymentId, transactionId];

        try {
            const [result] = await connection.query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error updating Payment_ID:', error);
            throw error;
        }
    }

    static async getRecentTransactions(userId) {
        try {
            const [rows] = await db.query('SELECT * FROM Transactions WHERE User_ID = ? ORDER BY Date DESC LIMIT 5', [userId]);
            return rows;
        } catch (error) {
            console.error('Error fetching recent transactions:', error);
            throw error;
        }
    }

    static async getTransactionDetails(transactionId) {
        const sql = `
            SELECT
                t.Transaction_ID,
                t.Transaction_Date,
                t.Total_Price,
                t.Status,
                u.Name AS UserName,
                p.Payment_ID,
                p.Payment_Type
            FROM Transaction t
            JOIN User u ON t.User_ID = u.User_ID
            LEFT JOIN Payment p ON t.Payment_ID = p.Payment_ID
            WHERE t.Transaction_ID = ?
        `;
        const [rows] = await db.query(sql, [transactionId]);
        return rows[0];
    }
}

module.exports = Transaction;