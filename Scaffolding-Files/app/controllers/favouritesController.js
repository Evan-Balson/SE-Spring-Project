const db = require('../services/db');
const Favourites = require('../models/favourites');

// Create an instance of Favourites
const favourites = new Favourites();

// Controller to handle adding an item to favourites
const addToFavourites = async (req, res) => {
    console.log("addToFavourites called");
    console.log("req.session.activeUser:", req.session.activeUser);
    console.log("req.body.inventoryId:", req.body.inventoryId);
    
    const { inventoryId } = req.body || req.query;
    const userId = req.session.activeUser?.userID;

    // Validate that the user ID and inventory ID are provided
    if (!userId || !inventoryId) {
        let errorMessage = '';
        if (!userId && !inventoryId) {
            errorMessage = 'User ID and Inventory ID are missing.';
        } else if (!userId) {
            errorMessage = 'User ID is missing.';
        } else {
            errorMessage = 'Inventory ID is missing.';
        }
        return res.status(400).json({ message: errorMessage });
    }

    try {
        // Add item to favourites
        const result = await favourites.addToFavourites(userId, inventoryId);

        // Check the result status and return appropriate message
        if (result.status === 'exists') {
            return res.status(400).json({ message: 'Item already in favorites.' });
        } else if (result.status === 'added') {
            return res.status(200).json({ message: 'Item added to favorites successfully.' });
        } else {
            return res.status(500).json({ message: 'Failed to add item to favorites.' });
        }
    } catch (error) {
        console.error('Error adding item to favorites:', error);
        return res.status(500).json({ message: 'Failed to add item to favorites.', error: error.message });
    }
};

// Controller to handle removing an item from favourites
const removeFromFavourites = async (req, res) => {
    const userId = req.session.activeUser?.userID;  // Accessing activeUser from session
    const inventoryId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!inventoryId) {
        return res.status(400).json({ message: 'Inventory ID is required.' });
    }

    try {
        // Remove item from favourites
        const result = await favourites.removeFromFavourites(userId, inventoryId);

        if (result) {
            // Redirect to the favorites page after removing an item
            return res.redirect("/favourites");
        } else {
            return res.status(500).json({ message: 'Failed to remove item from favorites.' });
        }
    } catch (error) {
        console.error('Error removing item from favorites:', error);
        return res.status(500).json({ message: 'Error removing item from favorites.', error: error.message });
    }
};

// Controller to handle filtered viewing of saved items for a user
const filterSavedItems = async (req, res) => {
    const userId = req.session.activeUser?.userID;  // Get the user ID from session
    const { sortOrder } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        let result;

        // Fetch saved items based on the sort order
        if (sortOrder === "oldest") {
            result = await favourites.viewSavedItems_oldest(userId);
        } else if (sortOrder === "newest") {
            result = await favourites.viewSavedItems(userId);
        } else {
            result = await favourites.viewSavedItems(userId);  // Default to newest if no sort order is provided
        }

        // Render the favourites page with the fetched items
        res.render("favourites", { title: 'Favourites', outfits: result });
    } catch (error) {
        console.error('Error fetching saved items:', error);
        return res.status(500).json({ message: 'Error fetching saved items.', error: error.message });
    }
};

// Export the controller functions
module.exports = {
    addToFavourites,
    removeFromFavourites,
    filterSavedItems
};