// Required: npm install multer
// for uploading images

const db = require('./db');
const multer = require('multer');
const path = require('path');

// Configure multer to save uploaded images to the public/images folder
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
});

const upload = multer({ storage: storage }); // Create multer instance

const listingController = {
    showNewListingForm: (req, res) => {
        res.render('new-listing');
    },
    submitListing: async (req, res) => {
        try {
            const { name, price, size, categories, colors, description } = req.body;
            const image = req.file;

            if (!name || !price || !description) {
                return res.status(400).send('Missing required fields');
            }

            if (!image) {
                return res.status(400).send('Please upload an image');
            }
            const imagePath = path.join('/images', image.filename);
            const categoryArray = categories.split(',').map((cat) => cat.trim());
            const query = `
                INSERT INTO Outfit (outfit_name, outfit_description, outfit_color, outfit_size, user_id, outfit_image) VALUES (?, ?, ?, ?, ?, ?)
            `;
            const result = await db.query(query, [name, description, colors, size, req.session.userId, imagePath]);
            const outfitId = result.insertId;
            const inventoryQuery = `
                INSERT INTO Inventory (outfit_id, price, item_availability, quantity) VALUES (?, ?, ?, ?)
            `;
            const inventoryResult = await db.query(inventoryQuery, [outfitId, price, false, 1]);
            const inventoryId = inventoryResult.insertId;

            res.render('new-listing', {
                successMessage: 'New listing with Inventory ID: ${inventoryId} has been added Successfully. See Item Listing',
                inventoryId: inventoryId,
            });
        } catch (error) {
            console.error('Error submitting listing: ', error);
            res.status(500).send('Internal Server Error');
        }
    },
};

module.exports = {
    listingController, upload
};