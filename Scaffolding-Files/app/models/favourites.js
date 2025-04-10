const db = require('./../services/db');
const { Inventory } = require('./Inventory');

class Favourites {

    inventory_ID;
    user_ID;

    constructor(){}

    // Remove item from favorites for a user
    async removeFromFavourites(User_ID, Inventory_ID) {
        var sql = 'DELETE FROM `Favorites` WHERE `User_ID` = ? AND `Inventory_ID` = ?;';
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
        const sql = `
            INSERT INTO Favorites (User_ID, Inventory_ID, Date_Added)
            VALUES (?, ?, NOW());
        `;
        var params = [User_ID, Inventory_ID];

        console.log("SQL Query:", sql);
        console.log("Parameters:", params);
        // Check for undefined values

        try {
            var result = await db.query(sql, params);
            console.log(result);   // Check the result from the database

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
            SELECT Inventory.*, Favorites.Date_Added
            FROM Inventory
            JOIN Favorites ON Favorites.Inventory_ID = Inventory.Inventory_ID
            WHERE Favorites.User_ID = ?
            ORDER BY Favorites.Date_Added DESC;
        `;
        var params = [User_ID];

        try {
            var result = await db.query(sql, params);

            // Convert dates to a desired format (YYYY-MM-DD)
            result.forEach(item => {
                if (item.Date_Added) {
                    item.Date_Added = new Date(item.Date_Added).toISOString().split('T')[0]; // YYYY-MM-DD format
                }
            });

            if (result && result.length > 0) {
                return result; // Return the saved items
            } else {
                console.log('No items found for this user.');
                return null; // Return null if no items are found
            }
        } catch (error) {
            console.error('Error during Database search:', error);
            throw error;
        }
    }


// View all saved items for a user, ordered by oldest
async viewSavedItems_oldest(User_ID) {
    var sql = `
        SELECT Inventory.*, Favorites.Date_Added
        FROM Inventory
        JOIN Favorites ON Favorites.Inventory_ID = Inventory.Inventory_ID
        WHERE Favorites.User_ID = ?
        ORDER BY Favorites.Date_Added ASC;
    `;
    var params = [User_ID];

    try {
        var result = await db.query(sql, params);
        console.log(result);

            // Convert dates to a desired format (YYYY-MM-DD)
            result.forEach(item => {
            if (item.Date_Added) {
                item.Date_Added = new Date(item.Date_Added).toISOString().split('T')[0]; // YYYY-MM-DD format
            }
            });

        if (result && result.length > 0) {
            return result; // Return the saved items
        } else {
            console.log('No items found for this user.');
            return null; // Return null if no items are found
        }
    } catch (error) {
        console.error('Error during Database search:', error);
        throw error;
    }
}

static async getRecentFavorites(userID) {
    const sql = "SELECT Inventory.Inventory_ID AS inventoryID, Inventory.Product_Image_Path AS image, Inventory.Name AS itemName FROM Favorites INNER JOIN Inventory ON Favorites.Inventory_ID = Inventory.Inventory_ID WHERE Favorites.User_ID = ? ORDER BY Favorites.Date_Added DESC LIMIT 3";
    const results = await db.query(sql, [userID]);
    return results;
}

async getFavouriteByUserAndInventory(userId, inventoryId) {
    const sql = 'SELECT * FROM Favorites WHERE User_ID = ? AND Inventory_ID = ?';
    try {
        const [rows] = await db.query(sql, [userId, inventoryId]);
        if (Array.isArray(rows) && rows.length > 0) {
            return rows[0];
        }
        return undefined; // Or null, depending on how you want to represent no match
    } catch (error) {
        console.error('Error finding favourite item:', error);
        throw error;
    }
}


}

module.exports = {Favourites};