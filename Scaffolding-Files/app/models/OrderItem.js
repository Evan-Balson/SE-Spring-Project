const db = require('../services/db');

class OrderItem {
    constructor(transactionId, inventoryId, quantity, price) {
        this.transaction_id = transactionId;
        this.inventory_id = inventoryId;
        this.quantity = quantity;
        this.price = price;
    }

    async create(connection) {
        const sql = `
            INSERT INTO OrderItem (transaction_id, inventory_id, quantity, price)
            VALUES (?, ?, ?, ?)
        `;
        const values = [this.transaction_id, this.inventory_id, this.quantity, this.price];
        try {
            const [result] = await connection.query(sql, values);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error creating order item:', error);
            throw error;
        }
    }

    static async getOrderItemsByTransactionId(transactionId) {
        const sql = `
            SELECT
                oi.quantity,
                oi.price,
                i.Name AS itemName,
                i.Product_Image_Path AS image
            FROM OrderItem oi
            JOIN Inventory i ON oi.inventory_id = i.Inventory_ID
            WHERE oi.transaction_id = ?
        `;
        const [rows] = await db.query(sql, [transactionId]);
        return rows;
    }
}

module.exports = OrderItem;