// returnController.js

const db = require('./../services/db');

const returnController = {
  getReturnPage: async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.redirect('/login');
      }

      const query = `
        SELECT
          Inventory.Name AS name,
          Inventory.Description AS description,
          Delivery.Delivery_Date AS deliveryDate,
          Transaction.Transaction_Date AS orderDate,
          Inventory.Inventory_ID AS inventoryId,
          Inventory.Product_Image_Path AS image,
          Transaction.Transaction_ID AS transactionId
        FROM Inventory
        JOIN Transaction ON Inventory.Inventory_ID = Transaction.Inventory_ID
        JOIN Delivery ON Transaction.Transaction_ID = Delivery.Transaction_ID
        WHERE Transaction.User_ID = ?
      `;

      const returnableItems = await db.query(query, [userId]);

      const returnableItemsWithImage = returnableItems.map((item) => ({
        ...item,
        image: item.image || '/images/default.jpg',
      }));

      res.render('return', { returnableItems: returnableItemsWithImage });
    } catch (error) {
      console.error('Error fetching returnable items:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  submitReturnRequest: async (req, res) => {
    try {
      const userId = req.session.userId;

      if (!userId) {
        return res.redirect('/login');
      }

      const returnRequests = [];
      for (const key in req.body) {
        if (key.startsWith('returnReason_')) {
          const inventoryId = key.split('_')[1];
          const transactionId = req.body['transactionId_' + inventoryId];
          const returnReason = req.body[key];
          const returnLocation = req.body['returnLocation_' + inventoryId];
          returnRequests.push({ inventoryId, transactionId, returnReason, returnLocation });
        }
      }

      for (const request of returnRequests) {
        const returnId = 'RETURN-' + Date.now();
        const insertQuery = `
          INSERT INTO Return (Return_ID, Transaction_ID, Inventory_ID, User_ID, Return_Reason, Return_Date, Return_Status, Return_Location)
          VALUES (?, ?, ?, ?, ?, CURDATE(), 'Pending', ?)
        `;
        await db.query(insertQuery, [returnId, request.transactionId, request.inventoryId, userId, request.returnReason, request.returnLocation]);

      }

      res.send('Return request submitted successfully!');
    } catch (error) {
      console.error('Error submitting return request:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = returnController;