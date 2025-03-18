// Get the functions in the db.js file to use
const db = require('./../services/db');

class User {
    userID;
    userName;
    userEmail;
    userPassword;
    userRole;
    userAddress;
    userContact;
    Profile_Image;
    login_Status;

    constructor(id, name, role, email, password, address, phone, image, login) {
        this.userID = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
        this.userContact = phone;  // Fixed here to `this.userContact`
        this.Profile_Image = image;
        this.login_Status = login;
    }

    setLoginStatus(login){
        this.login_Status = login;
    }
    static async authenticate(email, password) {
        var sql = 'SELECT * FROM `User` WHERE `Email_Address` = ? AND `Password` = ?';
        var params = [email, password];

        try {
            var result = await db.query(sql, params);
            //console.log(result);  // Check what the database returns

            if (result && result.length > 0) {
                var user = result[0];
                return new User(user.User_ID, user.Name, user.Role, user.Email_Address, user.Password, user.Address, user.Contact_Number, user.Profile_Image_Path);
            } else {
                console.log('No user found with the provided credentials.');
                return null;
            }
        } catch (error) {
            console.error('Error during authentication:', error);
            throw error;
        }
    }

    logout() {
        this.login_Status = false;
    }

    // Function to insert a new user into the database
    static async registerUser(userData){
        const { firstName, lastName, email, address, phone, password, image } = userData;
        //console.log(userData);
        const userID = `U${Date.now()}`;  // Generate a unique User_ID based on the timestamp
        const role = 'User';  // Default role is user
        const Address = address; 
        const emailAddress = email;
        const contactNumber = phone;  // Optional phone number
        const profileImagePath = "../images/profile.jpg";  // Optional, if you want to handle profile images
        const loginStatus = false;  // Default login status as false until they log in
        
            //const { firstName, lastName, email, address, phone, dob, , password, image } = userData;
        const sql = `
            INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        //INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status) VALUES

        const params = [userID, `${firstName} ${lastName}`, role, Address, emailAddress, contactNumber, password, profileImagePath, loginStatus];
        console.log(params)
        try {
            const result = await db.query(sql, params);  // Execute the query
            return result;
        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;  // Throw error to be handled by controller
        }
    };
}

module.exports = {
    User
}


