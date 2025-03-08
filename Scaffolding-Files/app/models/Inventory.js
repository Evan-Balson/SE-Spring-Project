import Outfit from './Outfit'
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inventory {

    // Attributes
    Inventory_ID;
    Price;
    isAvailable;
    quantity;
    outfit;


    constructor(id, price, availability, qty) {
        this.Inventory_ID = id;
        this.Price = price;
        this.isAvailable = availability;
        this.quantity = qty;
        this.outfit = Outfit;
    }

    // Methods
    
    async rent(){}
    async return(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inventory
}