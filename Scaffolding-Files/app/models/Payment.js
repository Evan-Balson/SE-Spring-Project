const db = require('../services/db');
const crypto = require('crypto');

class payment {
    constructor(paymentType, userId, totalAmount) {
        this.payment_type = paymentType;
        this.user_ID = userId;
        this.total_amount = totalAmount;
        this.payment_ID = null;
    }

    async addPaymentMethod(connection) {
        try {
            const sql = `
                INSERT INTO Payment (Payment_Type, User_ID, Total_Amount)
                VALUES (?, ?, ?)
            `;
            const [result] = await connection.query(sql, [this.payment_type, this.user_ID, this.total_amount]);
            this.payment_ID = result.insertId;
            return this;
        } catch (error) {
            console.error('Error adding payment method:', error);
            throw error;
        }
    }

    static generatePaymentId() {
        // Consider using the database's auto-increment or a numeric ID generation strategy
        return Math.floor(Math.random() * 100000);
    }

    static async getPaymentById(paymentId) {
        const [rows] = await db.query('SELECT * FROM Payment WHERE Payment_ID = ?', [paymentId]);
        return rows[0];
    }
}

module.exports = {
    payment
};
