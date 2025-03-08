
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Outfit_Management  extends IOutfitManagement{

    // Attributes
    outfit_ID;

    // Constructor

    constructor() {}

    // Methods
    
    async createOutfit(){}
    async removeOutfit(){}
    async updateDetails(){}

    async addReview(){}
    async getReview(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Outfit_Management
}