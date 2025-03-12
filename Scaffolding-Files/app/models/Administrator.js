
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
            verifyUserSQL =
            `--placeholder text because sql database hasn't been updated with verified variables`;
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
    async inspectItem(outfit_id){
        try{
            var inspectSQL =
            `UPDATE inspection
            SET pass_status = 1
            WHERE outfit_id = ?`;

            var result = await db.query(inspectSQL, outfit_id);

            return result;
        
        } catch (error) {
            console.error("Error could not inspect item:", error);
            throw error;
        }
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Administrator
}