// delivery.js

// Get the functions in the db.js file to use
const db = require('./../services/db');

class Delivery {
  // Attributes
  deliveryAddress;
  deliveryOption;
  deliveryDate;
  transactionId;

  constructor(address, option, date, transactionId) {
    this.deliveryAddress = address;
    this.deliveryOption = option;
    this.deliveryDate = date;
    this.transactionId = transactionId;
  }

  // Methods
  async getDeliveryInfo() {
    try {
      const query = `
        SELECT Delivery_Address, Delivery_Option, Delivery_Date
        FROM Delivery
        WHERE Transaction_ID = ?
      `;
      const result = await db.query(query, [this.transactionId]);

      if (result && result.length > 0) {
        return result[0]; // Return the first delivery info found
      } else {
        return null; // Delivery info not found
      }
    } catch (error) {
      console.error('Error getting delivery info:', error);
      return null;
    }
  }

  async createDelivery() {
    try {
      const query = `
        INSERT INTO Delivery (Delivery_Address, Delivery_Option, Delivery_Date, Transaction_ID)
        VALUES (?, ?, ?, ?)
      `;
      const result = await db.query(query, [
        this.deliveryAddress,
        this.deliveryOption,
        this.deliveryDate,
        this.transactionId,
      ]);

      return result; // Return the result of the insert operation
    } catch (error) {
      console.error('Error creating delivery:', error);
      return null;
    }
  }

  async updateDelivery(){
    try{
      const query = `
        UPDATE Delivery
        SET Delivery_Address = ?, Delivery_Option = ?, Delivery_Date = ?
        WHERE Transaction_ID = ?
      `;

      const result = await db.query(query, [
        this.deliveryAddress,
        this.deliveryOption,
        this.deliveryDate,
        this.transactionId,
      ]);

      return result;
    } catch(error){
      console.error("Error updating delivery:", error);
      return null;
    }
  }
}

// xport functions
module.exports = {
  Delivery,
};