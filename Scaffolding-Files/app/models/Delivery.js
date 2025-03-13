
// Get the functions in the db.js file to use
const db = require('./../services/db');

class delivery {

    // Attributes
    delivery_id;
    delivery_Address;
    delivery_Option;
    delivery_Date;
    transaction_id


    constructor(id, address, option, date, transactionID) {
        this.delivery_id = id;
        this.delivery_Address = address;
        this.delivery_Option = option;
        this.delivery_Date = date;
        this.transaction_id = transactionID;
    }

    // Methods
    
    async getDeliveryInfo(){
        return this.delivery_id
        + this.delivery_Address
        + this.delivery_Option
        + this.delivery_Date
        + this.transaction_id;
    }

    async addDeliveryInfoToDB(){
        try{
            var deliverySQL = 
            `INSERT INTO delivery(
                delivery_id,
                delivery_address,
                delivery_option,
                delivery_date,
                transaction_id)
            VALUES
                (?, ?, ?, ?, ?)`; // curdate() would get the current date
            
            // stores it into the result variable
            var result = await db.query (deliverySQL, [this.delivery_id, this.delivery_Address, this.delivery_Option, this.delivery_Date, this.transaction_id])
            return result;

        // if error it will print to console
        } catch (error) {
            console.error("Error generating fashion advice:", error);
            throw error;
        }        
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    delivery
}