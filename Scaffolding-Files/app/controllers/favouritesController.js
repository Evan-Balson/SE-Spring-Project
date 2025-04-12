const {Favourites} = require('../models/favourites');

// Create an instance of Favourites
const favourites = new Favourites();


const addToFavourites = async (userId, inventoryId) => {
    // Log values for debugging
    console.log("Controller - addToFavourites:", { userId, inventoryId });
    if (!userId || !inventoryId) {
      throw new Error("User ID or Inventory ID is missing.");
    }
    // Call the model function to add the item to favourites.
    await favourites.addToFavourites(userId, inventoryId);
  };

// Controller to handle removing an item from favorites
const removeFromFavourites = async (req, res) => {
    const User_ID = req.session.activeUser.userID; // Accessing activeUser from session
    console.log(User_ID);
    const Inventory_ID = req.params.id;
    console.log(Inventory_ID);
    console.log("The Inventory Item is:", Inventory_ID);

    if (!Inventory_ID) {
        return res.status(400).json({ message: 'Inventory_ID are required.' });
    }

    try {
        const result = await favourites.removeFromFavourites(User_ID, Inventory_ID);

        if (result) {

            //res.status(200).json({ message: 'Item removed from favorites.' });
            return res.redirect("/favourites");
        } else {
            return res.status(500).json({ message: 'Failed to remove item from favorites.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error removing item from favorites.', error: error.message });
    }
};



// Controller to handle filtered viewing saved items for a user
const filterSavedItems = async (req, res) => {

    User_ID = req.session.activeUser.userID;
    const {sortOrder} = req.body
    
    console.log(User_ID);
    if (!User_ID) {
        // If User_ID is not provided, just return null or throw an error
        throw new Error('User_ID is required.');
    }

    let result;

    try {
        // Log User_ID for debugging purposes
        console.log('Fetching saved items for User_ID:', User_ID);

        if (sortOrder == "oldest") {result = await favourites.viewSavedItems_oldest(User_ID);}
        else if (sortOrder == "newest") {result = await favourites.viewSavedItems(User_ID);}
        else if (!sortOrder) {result = await favourites.viewSavedItems(User_ID);}
        // Call the model's function to get saved items

        console.log(sortOrder);
        
        return res.render("favourites", { title: 'Favourites', outfits: result });

    } catch (error) {
        // Log and rethrow the error to be handled in the route
        console.error('Error fetching saved items:', error.message);
        throw new Error('Error fetching saved items: ' + error.message);
    }
    
};

// Export the controller functions
module.exports = {
    addToFavourites,
    removeFromFavourites,
    filterSavedItems
};