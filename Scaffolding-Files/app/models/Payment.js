// Get the functions in the db.js file to use
const db = require('./../services/db');

class Payment{

    // Attributes
    paymentID;
    paymentType;
    paymentDetails;




    // Constructor

    constructor(id,type,details) {
        this.userID = id;
        this.paymentType = type;
        this.paymentDetails = details;
    }

    // Methods
    
    async getPaymentInfo() {
    }
    
    async updatePaymentInfo()  {
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Payment
}