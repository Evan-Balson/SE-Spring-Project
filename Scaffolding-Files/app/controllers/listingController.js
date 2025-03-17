// Required: npm install multer
// for uploading images

const db = require('./db');
const multer = require('multer');
const path = require('path');

// Configure multer to save uploaded images to the public/images folder
const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname+ '-' + uniqueSuffix + fileExtension);
    },
});

const upload = multer({storage: storage}); // Create multer instance


const listingController = { showNewListingForm: (req, res) => {
    res.render('new-listing');
},
submitListing: async (req, res) => {
    try{
        const {name, price, size, categories, colors, description} = req.body;
        const image = req.file;

        if (!name || !price || !description) {
            return res.status(400).send('Missing required fields');
        }

        if (!image) {
            return res.status(400).send('Please upload an image');
        }
        const imagePath = `/images/${image.filename}`;
        const sku = generateSku();
        const categoryArray = categories.split(',').map((cat) => cat.trim());
        const query = `
        INSERT INTO Outfit (outfit_name, outfit_description, outfit_color, outfit_size, user_id) VALUES (?, ?, ?, ?, ?)
      `;
        const result = await db.query(query, [name, description, colors, size, req.session.userId]);
        const outfitId = result.insertId;
        const inventoryQuery = `
        INSERT INTO Inventory (outfit_id, price, item_availability, quantity) VALUES (?, ?, ?, ?)
      `;
      await db.query (inventoryQuery, [outfitId, price, true, 1]);

      const imageQuery = 'UPDATE Outfit SET image_path = ? WHERE outfit_id = ?';

      await db.query(imageQuery, [imagePath, outfitId]);

      res.redirect('/listings');
    } catch (error) {
        console.error('Error submitting listing: ', error);
        res.status(500).send('Internal Server Error');
    }
},

};

// Function to generate a unique SKU
function generateSku() {
    return 'SKU-' + Date.now();
}
module.exports = {
    listingController, upload
};