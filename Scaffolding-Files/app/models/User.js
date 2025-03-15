const { Payment } = require('./Payment'); //importing payment model
const { IUserManagement } = require('./IUserManagement'); //importing interface for user

const db = require('./../services/db'); //importing the files in the db file to use

class User extends IUserManagement{
    
    //user attributes
    userID;
    userName;
    userEmail;
    userPassword;
    userRole;
    userAddress;

    //constructor
    constructor(id,name,email,password,role,address) {
        super();
        this.userID = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
        // using aggregation to create payment method.
        this.paymentMethod = Payment;

    }

    //methods implemented from IUserManagement 
    async buy() {
        console.log('Renting outfit...');
    }
    
    async sell() {
        console.log('Selling outfit...');
    }
    
    async addOutfit() {
    }

    async writeReview() {
    }

    async addPaymentMethod() {
        console.log('Adding a payment method...');
    }

    async updatePaymentMethod() {
        console.log('Updating the payment method...');
    }
 
    async removePaymentMethod() {
        console.log('Removing the payment method...');
    }

    async login() {
        console.log('Logging in...');
    }

    async logout() {
        console.log('Logging out...');
    }
}


// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    User
}