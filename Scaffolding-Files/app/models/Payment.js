// Get the functions in the db.js file to use
const db = require('../services/db');

class Payment{

    // Attributes
    payment_ID;
    payment_type;
    transaction_ID

    // Constructor
    constructor(paymentId, paymentType, transactionId) {
        this.payment_ID = paymentId;
        this.payment_type = paymentType;
        this.transaction_ID = transactionId;
    }

    // Methods
    async add_payment_method(){
        try {
            const pMethodSQL = 
            `INSERT INTO Payment_Method (
            payment_id,
            payment_type,
            transaction_id)`;

            var result = await db.query(pMethodSQL, [this.payment_ID, this.payment_type, this.transaction_ID]);

            return result;
            
        } catch (error) {
            console.error("Error adding payment method:", error);
            throw error;
        }
    }
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Payment
}