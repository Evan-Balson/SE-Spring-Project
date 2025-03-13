
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
        return this.category_Name;
    }

    async addCatergoryToDB(){
        try {
            var categorySQL = 
            `INSERT INTO category(
                category_id,
                category_name)
            VALUES
                (?, ?)`; // curdate() would get the current date
            
            // stores it into the result variable
            var result = await db.query (categorySQL, [this.category_ID, this.category_Name])
            return result;
        } catch (error) {
            console.error("Error updating database:",error);
        } 
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    category
}