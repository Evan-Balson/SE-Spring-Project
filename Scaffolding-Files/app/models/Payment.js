const db = require('../services/db');
const crypto = require('crypto');

class Payment {
  constructor(paymentType, transactionId, userId, totalAmount) {
      this.payment_type = paymentType;
      this.transaction_ID = transactionId;
      this.user_ID = userId;
      this.total_amount = totalAmount;
      this.payment_ID = null;
  }

  async addPaymentMethod() {
      const connection = await db.getConnection();
      try {
          await connection.beginTransaction();

          const sql = `
              INSERT INTO Payment (Payment_Type, Transaction_ID, User_ID, Total_Amount)
              VALUES (?, ?, ?, ?)
          `;
          const [result] = await connection.query(sql, [this.payment_type, this.transaction_ID, this.user_ID, this.total_amount]);

          this.payment_ID = result.insertId;

          await connection.commit();
          return this;
      } catch (error) {
          await connection.rollback();
          console.error('Error adding payment method:', error);
          throw error;
      } finally {
          connection.release();
      }
  }

  static generatePaymentId() {
      return 'PAY_' + crypto.randomBytes(16).toString('hex');
  }
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Payment
}
