import Outfit from './Outfit'

// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inspection {

    // Attributes
    Authentication_ID;
    verification_Date;
    Status; // True meaning item passed inspection, false meaning failed.
    outfit;


    constructor(id, date, Outfit) {
        this.Authentication_ID = id;
        this.verification_Date = date;
        this.Status = false;
        this.outfit = Outfit;
    }

    // Methods
    
    async verifyItem (){
        try{
            var inspectSQL =
            `UPDATE inspection
            SET pass_status = 1
            WHERE outfit_id = ?`;

            var result = await db.query(inspectSQL, outfit);

            this.Status = true;

            return result;

        } catch (error) {
            console.error("Error could not inspect item:", error);
            throw error;
        }
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inspection
}