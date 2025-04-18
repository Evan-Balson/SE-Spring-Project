const { Inventory } = require("../models/Inventory");

const showOutfitListing = async (req, res) => {
    try {
        const { id } = req.params;  // Get Inventory ID from the route parameter
        
        // Fetch product details using the provided Inventory_ID
        const item = await Inventory.displayinventoryItem(id);
        
        if (item) {
            // Retrieve the active user from locals
            const user = res.locals.activeUser;
            // Render different views based on whether the user is logged in
            console.log(user);
            if (user && user.login_Status) {
                return res.render("outfit-listing", { title: 'Listing', product: item });
            } else {
                return res.render("outfit-listing-logged-out", { title: 'Listing', product: item });
            }
        } else {
            // Handle case where the product is not found
            return res.status(404).send("Product not found");
        }
    } catch (error) {
        // Handle any errors during the process
        console.error('Error during fetching the product:', error);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports = { showOutfitListing };
