//import Outfit from './Outfit'
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inventory {

    // Attributes
    Inventory_ID;
    Price;
    isAvailable;
    quantity;
    outfit;


    constructor(id, price, availability, qty) {
        this.Inventory_ID = id;
        this.Price = price;
        this.isAvailable = availability;
        this.quantity = qty;
        this.outfit = Outfit;
    }

    // Methods
    
    async rent(){}
    async return(){}

    static async displayinventory(itemsPerPage, currentPage) {
        // Calculate the OFFSET for pagination
        const offset = (currentPage - 1) * itemsPerPage;

        // Query the database
        var sql = `SELECT * FROM Inventory LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

        try {
            var results = await db.query(sql);
           

            // Determine if there's a next or previous page
            const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
            const prevPage = currentPage > 1 ? currentPage - 1 : null;

            // If there are more than the itemsPerPage, pop the extra item
            if (results.length === itemsPerPage + 1) {
                results.pop();
            }
            //console.log(results);

            return {
                results,
                nextPage,
                prevPage
            };
        } catch (error) {
            console.error("Error fetching inventory:", error);
            throw error;
        }
    }

    static async displayinventoryItem(id) {
        // Use parameterized queries to prevent SQL injection
        const sql = "SELECT * from Inventory WHERE Inventory_ID = ?";
    
        try {
            const result = await db.query(sql, [id]);  // Pass `id` as an array to avoid direct interpolation
            console.log(result);  // Check the result object structure
            return result[0];  // Return the first row (product) if found
        } catch (error) {
            console.error("Error fetching inventory item:", error);
            throw error;
        }
    }
    
    static async displayNewestinventory(itemsPerPage, currentPage) {
        // Calculate the OFFSET for pagination
        const offset = (currentPage - 1) * itemsPerPage;

        // Query the database *********** inventory does not have a date ************
        var sql = `SELECT * FROM Inventory 
            ORDER BY created_at DESC 
            LIMIT ${itemsPerPage + 1} OFFSET ${offset};`;

        try {
            var results = await db.query(sql);
           

            // Determine if there's a next or previous page
            const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
            const prevPage = currentPage > 1 ? currentPage - 1 : null;

            // If there are more than the itemsPerPage, pop the extra item
            if (results.length === itemsPerPage + 1) {
                results.pop();
            }
            //console.log(results);

            return {
                results,
                nextPage,
                prevPage
            };
        } catch (error) {
            console.error("Error fetching inventory:", error);
            throw error;
        }
    }
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inventory
}