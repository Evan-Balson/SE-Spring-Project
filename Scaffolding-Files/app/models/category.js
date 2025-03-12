
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
    
    async getCategory_Name(){
        try {
            const [rows] = await db.query('SELECT category_name FROM Category WHERE category_name =?',
                [this.category_Name]
            );
            if (rows.length > 0) {
                return rows[0].category_Name;
            }else {
                return null; // Category not found
            }
        } catch (error) {
            console.error('Error getting category name:', error);
            return null;
        }
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    category
}