// Get the functions in the db.js file to use
const db = require('./../services/db');

class Favourites {

    inventory_ID;
    user_ID;

    constructor(){}

    // Remove item from favorites for a user
    async removeFromFavourites(User_ID, Inventory_ID) {
        var sql = `
            DELETE FROM Favorites 
            WHERE User_ID = ? AND Inventory_ID = ?;
        `;
        var params = [User_ID, Inventory_ID];

        try {
            var result = await db.query(sql, params);
            console.log(result);  // Check the result from the database

            if (result.affectedRows > 0) {
                console.log('Item removed from favorites.');
                return true;
            } else {
                console.log('No matching item found to remove.');
                return false;
            }
        } catch (error) {
            console.error('Error during database operation:', error);
            throw error;
        }
    }

    // Add item to favorites for a user
    async addToFavourites(User_ID, Inventory_ID) {
        var sql = `
            INSERT INTO Favorites (User_ID, Inventory_ID)
            VALUES (?, ?);
        `;
        var params = [User_ID, Inventory_ID];

        try {
            var result = await db.query(sql, params);
            console.log(result);  // Check the result from the database

            if (result.affectedRows > 0) {
                console.log('Item added to favorites.');
                return true;
            } else {
                console.log('Failed to add item to favorites.');
                return false;
            }
        } catch (error) {
            console.error('Error during database operation:', error);
            throw error;
        }
    }

    // View all saved items for a user
    async viewSavedItems(User_ID) {
        var sql = `
            SELECT Inventory.* 
            FROM Inventory
            JOIN Favorites ON Favorites.Inventory_ID = Inventory.Inventory_ID
            WHERE Favorites.User_ID = ?;
        `;
        var params = [User_ID];
    
        try {
            var result = await db.query(sql, params);
            //console.log(result);  // Check what the database returns
    
            if (result && result.length > 0) {
                return result; // Return the saved items
            } else {
                console.log('No items found for this user.');
                return null; // Return an empty array instead of 0
            }
        } catch (error) {
            console.error('Error during Database search:', error);
            throw error;
        }
    }
}

module.exports = {Favourites}
