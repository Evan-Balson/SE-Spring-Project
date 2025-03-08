
// Get the functions in the db.js file to use
const db = require('./../services/db');

class category {

    // Attributes
    category_Name;
    category_ID;


    constructor(id, name) {
        this.category_ID = id;
        this.category_Name = name;
    }

    // Methods
    
    async getCategory_Name(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    category
}