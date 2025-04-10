const db = require('../services/db');
const path = require('path');


// Revised controller using a single Inventory table
const listingController = {
  showNewListingForm: (req, res) => {
    res.render('new-listing');
  },

  submitListing: async (req, res) => {
    try {
      const { name, price, size, colors, description, quantity, condition } = req.body;
      const image = req.file;

      const userId = req.session.activeUser ? req.session.activeUser.userID : null;

      if (!req.session.activeUser) {
        return res.status(401).send('User not authenticated');
      }

      if (!name || !price || !description || !quantity || !condition || !size || !colors) {
        return res.status(400).send('Missing required fields');
      }
      if (!image) {
        return res.status(400).send('Please upload an image');
      }

      const imagePath = path.join('/images', image.filename);

      const inventoryId = `I${Date.now()}`;

      // Insert into Inventory table with consistent column names
      const inventoryQuery = `
        INSERT INTO Inventory (
          Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        inventoryId,
        price,
        false, // Availability set by default
        quantity,
        name,
        colors,
        size,
        description,
        condition,
        userId,
        imagePath
      ];

      const result = await db.query(inventoryQuery, values);

      // Insert into Inspection table
      const inspectionQuery = `
        INSERT INTO Inspection (AUTH_ID, Inventory_ID, Verification_Date, Pass_Status)
        VALUES (?, ?, ?, ?)
       `;

      const authId = `A${Date.now()}`; // Generate a unique AUTH_ID
      const verificationDate = new Date().toISOString().split('T')[0]; // Current date
      
      await db.query(inspectionQuery, [authId, inventoryId, verificationDate, 0]);


      res.render('new-listing', {
        successMessage: `New listing with Inventory ID: ${inventoryId} has been added successfully. See Item Listing.`,
        inventoryId
      });
    } catch (error) {
      console.error('Error submitting listing: ', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = {listingController};