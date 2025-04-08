// Get the functions in the db.js file to use
const db = require('./../services/db');
const bcrypt = require("bcryptjs");

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
        this.userContact = phone;
        this.Profile_Image = image;
        this.login_Status = login;
    }

    setLoginStatus(login){
        this.login_Status = login;
    }

    static async authenticate(email, password) {
        var sql = 'SELECT * FROM `User` WHERE `Email_Address` = ?';

        try {
            const result = await db.query(sql, [email]);

            if (result && result.length > 0) {
                const user = result[0];
                const passwordMatch = await bcrypt.compare(password, user.Password);
                if (passwordMatch) {
                    return new User(user.User_ID, user.Name, user.Role, user.Email_Address, user.Password, user.Address, user.Contact_Number, user.Profile_Image_Path);
                } else {
                    console.log('Incorrect password');
                    return null;
                }
            } else {
                console.log('No user found with the provided email.');
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

    static async registerUser(userData){
        const { firstName, lastName, email, address, phone, password, image } = userData;
        const userID = `U${Date.now()}`;
        const role = 'User';
        const Address = address; 
        const emailAddress = email;
        const contactNumber = phone; 
        var profileImagePath = null;
        if(image){
            profileImagePath = image;
        }
        else{profileImagePath = "../images/default-profile-image.jpg";}
        const loginStatus = false;  // Default login status as false until they log in
        
            //const { firstName, lastName, email, address, phone, dob, , password, image } = userData;
        const sql = `
            INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        //INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status) VALUES

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed password:", hashedPassword);
            const sql = `
                INSERT INTO User (User_ID, Name, Role, Address, Email_Address, Contact_Number, Password, Profile_Image_Path, login_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const params = [userID, `${firstName} ${lastName}`, role, Address, emailAddress, contactNumber, hashedPassword, profileImagePath, loginStatus];
            const result = await db.query(sql, params);
            return result;
        } catch (error) {
            console.error('Error during user registration:', error);
            throw error;
        }
    };


    static async findById(id) {
        const sql = 'SELECT * FROM `User` WHERE `User_ID` = ?';
        try {
          const result = await db.query(sql, [id]);
          if (result && result.length > 0) {
            const user = result[0];
            return new User(
              user.User_ID,
              user.Name,
              user.Role,
              user.Email_Address,
              user.Password,
              user.Address,
              user.Contact_Number,
              user.Profile_Image_Path,
              user.login_status
            );
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error in User.findById:", error);
          throw error;
        }
      }
}



module.exports = {
    User
}