const db = require('./db');
const multer = require('multer');
const path = require('path');

// Configure multer to save uploaded images to the public/images folder
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  },
});

const upload = multer({ storage });

// Revised controller using a single Inventory table
const listingController = {
  showNewListingForm: (req, res) => {
    res.render('new-listing');
  },

  submitListing: async (req, res) => {
    try {
      const { name, price, size, colors, description, quantity, condition } = req.body;
      const image = req.file;

      if (!name || !price || !description || !quantity || !condition) {
        return res.status(400).send('Missing required fields');
      }
      if (!image) {
        return res.status(400).send('Please upload an image');
      }

      const imagePath = path.join('/images', image.filename);

      // Insert into Inventory table with consistent column names
      const inventoryQuery = `
        INSERT INTO Inventory (
          Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        price,
        false, // Availability set by default
        quantity,
        name,
        colors,
        size,
        description,
        condition,
        req.session.userId,
        imagePath
      ];
      const result = await db.query(inventoryQuery, values);
      const inventoryId = result.insertId;

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

module.exports = {
  listingController,
  upload,
};
