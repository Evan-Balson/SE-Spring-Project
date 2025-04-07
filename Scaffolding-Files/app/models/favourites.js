// Get the functions in the db.js file to use
const db = require('./../services/db');

class Favourites {

    inventory_ID;
    user_ID;

    constructor() {}

    // Remove item from favorites for a user
    async removeFromFavourites(User_ID, Inventory_ID) {
        const sql = 'DELETE FROM Favorites WHERE User_ID = ? AND Inventory_ID = ?';
        const params = [User_ID, Inventory_ID];

        try {
            const result = await db.query(sql, params);
            console.log(result);

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

    // Add item to favorites for a user using INSERT IGNORE and pre-check
    async addToFavourites(User_ID, Inventory_ID) {
        const checkSql = 'SELECT * FROM Favorites WHERE User_ID = ? AND Inventory_ID = ? LIMIT 1';
        const insertSql = 'INSERT IGNORE INTO Favorites (User_ID, Inventory_ID) VALUES (?, ?)';
        const params = [User_ID, Inventory_ID];

        try {
            const exists = await db.query(checkSql, params);
            if (exists.length > 0) {
                console.log('Item already in favorites.');
                return { status: 'exists' };
            }

            const result = await db.query(insertSql, params);
            console.log(result);

            if (result.affectedRows > 0) {
                console.log('Item added to favorites.');
                return { status: 'added' };
            } else {
                console.log('Insert ignored (probably already exists).');
                return { status: 'ignored' };
            }
        } catch (error) {
            console.error('Error during database operation:', error);
            throw error;
        }
    }

    // View all saved items for a user
    async viewSavedItems(User_ID) {
        const sql = `
            SELECT Inventory.*, Favorites.Date_Added
            FROM Inventory
            JOIN Favorites ON Favorites.Inventory_ID = Inventory.Inventory_ID
            WHERE Favorites.User_ID = ?
            ORDER BY Favorites.Date_Added DESC
        `;
        const params = [User_ID];

        try {
            const result = await db.query(sql, params);

            result.forEach(item => {
                if (item.Date_Added) {
                    item.Date_Added = new Date(item.Date_Added).toISOString().split('T')[0]; // Format: YYYY-MM-DD
                }
            });

            return result.length > 0 ? result : null;
        } catch (error) {
            console.error('Error during database search:', error);
            throw error;
        }
    }

    // View all saved items ordered by oldest
    async viewSavedItems_oldest(User_ID) {
        const sql = `
            SELECT Inventory.*, Favorites.Date_Added
            FROM Inventory
            JOIN Favorites ON Favorites.Inventory_ID = Inventory.Inventory_ID
            WHERE Favorites.User_ID = ?
            ORDER BY Favorites.Date_Added ASC
        `;
        const params = [User_ID];

        try {
            const result = await db.query(sql, params);

            result.forEach(item => {
                if (item.Date_Added) {
                    item.Date_Added = new Date(item.Date_Added).toISOString().split('T')[0]; // Format: YYYY-MM-DD
                }
            });

            return result.length > 0 ? result : null;
        } catch (error) {
            console.error('Error during database search:', error);
            throw error;
        }
        console.log(result);
    }
}

module.exports = Favourites ;