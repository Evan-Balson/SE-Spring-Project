
// Get the functions in the db.js file to use
const db = require('./../services/db');


// importing the user class because Administrator inherits from User
const { User } = require('./User'); 

class Administrator extends User {

    // no additional attributes

    constructor(id, name, email, password, address, payment) {
        // super calls the parent constructor 
        // hardcoding the role to ADMIN since it will always be admin for admin
        super(id, name, email, password, "ADMIN", address, payment)
    }

    // Methods
    // verifying user
    async verifyUser(userID){
        try{
            verifyUserSQL = `SELECT * FROM User`;
            var result = await db.query(verifyUserSQL, [userID]);
            return result;
        } catch (error) {
            console.error("Error failed to verify user:", error);
            throw error;
        }
    
    }

    // monitors the outfit listings, approving them
    async monitorListingActivity(){}

    // nothing to resolve in the database
    async resolveDisputes(){}

    // changes the pass_status in the inspection table
    async getItemsToInspect() {
        try {
            const query = `
                SELECT i.Inventory_ID, i.Name, i.Description, i.Price, i.Quantity, i.Color, i.Size, i.Product_Image_Path
                FROM Inventory i
                JOIN Inspection ins ON i.Inventory_ID = ins.Inventory_ID
                WHERE ins.Pass_Status = 0;`; // Fetch items with Pass_Status = 0 (not inspected)
            const result = await db.query(query);
            return result;
        } catch (error) {
            console.error("Error fetching items to inspect:", error);
            throw error;
        }
    }

    async approveItem(inventoryId) {
        try {
            const query = `UPDATE Inspection SET Pass_Status = 1 WHERE Inventory_ID = ?;`;
            await db.query(query, [inventoryId]);
        } catch (error) {
            console.error("Error approving item:", error);
            throw error;
        }
    }
    
    async rejectItem(inventoryId) {
        try {
            const query = `DELETE FROM Inspection WHERE Inventory_ID = ?;`;
            await db.query(query, [inventoryId]);
        } catch (error) {
            console.error("Error rejecting item:", error);
            throw error;
        }
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Administrator
}