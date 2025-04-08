
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
    
    static async getCategory_Names(){
        const sql = `SELECT Category_Name FROM Category`;
        try {
          const result = await db.query(sql);  // Executes the SQL query
          //console.log(result);
          return result;  // For PostgreSQL (pg), the data is in result.rows
        } catch (error) {
          console.error('Error fetching category names:', error.message);
          throw new Error('Error fetching category names');
        }
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    category
}