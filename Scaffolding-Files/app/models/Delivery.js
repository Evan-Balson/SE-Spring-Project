
// Get the functions in the db.js file to use
const db = require('./../services/db');

class delivery {

    // Attributes
    delivery_Address;
    delivery_Option;
    delivery_Date;


    constructor(address, option, date) {
        this.delivery_Address = address;
        this.delivery_Option = option;
        this.delivery_Date = date;
    }

    // Methods
    
    async getDeliveryInfo(){}

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    delivery
}