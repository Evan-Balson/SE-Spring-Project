
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Fashion_Advice {

    // Attributes
    fashion_Advice_ID;
    fashion_Advice_Content;
    date_Created;


    constructor(id,content,date) {
        this.fashion_Advice_ID = id;
        this.fashion_Advice_Content = content;
        this.date_Created;
    }

    // Methods
    
    async getFashionAdviceDetails(){}
    async generateFashionAdvice(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Fashion_Advice
}