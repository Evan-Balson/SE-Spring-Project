
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Transaction {

    // Attributes
    transaction_ID;
    date;
    total_price;
    inventory_IDs = [];
    userID;

    // Constructor

    constructor(id,name,email,password,role,address) {
        this.userID = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
    }

    // Methods
    
    async checkout() {
    }
    
    async checkInventory()  {
    }
    
    async () {
    }

    async writeReview(){}
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    User
}