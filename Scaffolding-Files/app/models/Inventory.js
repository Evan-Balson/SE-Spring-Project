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

    static async displayinventory(itemsPerPage, currentPage, filters = {}) {
        const offset = (currentPage - 1) * itemsPerPage;
        const limit = itemsPerPage + 1;
    
        let sql = `SELECT * FROM Inventory WHERE Availability = 1`;
        let params = [];
    
        // Apply filters dynamically
        if (filters.category) {
            sql += ` AND Category = ?`;
            params.push(filters.category);
        }
    
        if (filters.location) {
            sql += ` AND Location = ?`;
            params.push(filters.location);
        }
    
        // Apply sorting
        if (filters.sortOrder === 'newest') {
            sql += ` ORDER BY CreatedAt DESC`;
        } else if (filters.sortOrder === 'oldest') {
            sql += ` ORDER BY CreatedAt ASC`;
        } else if (filters.price === 'lowToHigh') {
            sql += ` ORDER BY Price ASC`;
        } else if (filters.price === 'highToLow') {
            sql += ` ORDER BY Price DESC`;
        }
    
        // Pagination
        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
    
        try {
            const results = await db.query(sql, params);
    
            const nextPage = results.length === limit ? currentPage + 1 : null;
            const prevPage = currentPage > 1 ? currentPage - 1 : null;
    
            if (results.length === limit) {
                results.pop(); // remove the extra item used to check if next page exists
            }
    
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