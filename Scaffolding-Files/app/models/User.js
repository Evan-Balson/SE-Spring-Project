import Payment from './Payment'

// Get the functions in the db.js file to use
const db = require('./../services/db');

class User  extends IUserManagement{

    // Attributes
    userID;
    userName;
    userEmail;
    userPassword;
    userRole;
    userAddress;



    // Constructor

    constructor(id,name,email,password,role,address) {
        this.userID = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
        // using aggregation to create payment method.
        this.paymentMethod = Payment;

    }

    // Methods
    
    async buy() {
    }
    
    async sell()  {
    }
    
    async addOutfit() {
    }

    async writeReview(){}

    static async authenticate(email, password) {
        // Mock database check
        if (email === "user@example.com" && password === "password123") {
            return new User(1, email, password);
        } else {
            return null;
        }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    User
}