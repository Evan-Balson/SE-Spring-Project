const db = require('../services/db');
const path = require('path');

// Show the form to create a new listing
const showNewListingForm = (req, res) => {
    res.render('new-listing');
};

// Handle form submission for a new listing
const submitListing = async (req, res) => {
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

        // Insert into Inventory table
        const inventoryQuery = `
            INSERT INTO Inventory (
                Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const inventoryValues = [
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

        await db.query(inventoryQuery, inventoryValues);

        // Insert into Inspection table
        const inspectionQuery = `
            INSERT INTO Inspection (AUTH_ID, Inventory_ID, Verification_Date, Pass_Status)
            VALUES (?, ?, ?, ?)
        `;

        const authId = `A${Date.now()}`;
        const verificationDate = new Date().toISOString().split('T')[0];

        await db.query(inspectionQuery, [authId, inventoryId, verificationDate, 0]);

        return res.render('new-listing', {
            successMessage: `New listing with Inventory ID: ${inventoryId} has been added successfully. See Item Listing.`,
            inventoryId
        });
    } catch (error) {
        console.error('Error submitting listing: ', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    showNewListingForm,
    submitListing
};
