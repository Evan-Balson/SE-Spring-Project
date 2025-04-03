import Outfit from './Outfit'

// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inspection {

    // Attributes
    Authentication_ID;
    verification_Date;
    Status; // True meaning item passed inspection, false meaning failed.
    outfit;


    constructor(id,date,status) {
        this.Authentication_ID = id;
        this.verification_Date = date;
        this.Status = status;
        this.outfit = Outfit;
    }

    // Methods
    
    async verifyItem (){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inspection
}