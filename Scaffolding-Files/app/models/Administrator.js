
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Administrator {

    // Attributes

    constructor() {}

    // Methods
    
    async verifyUser(){}
    async MonitorListingActivity(){}
    async resolveDisputes(){}
    async inspectItem(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Administrator
}