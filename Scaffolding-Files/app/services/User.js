// import User from './user';

require ("dotenv").config()  // Load environmet variables

// Import database connection module
const fitxchange = require('./../services/db');

class User {
    userID;
    userName;
    userEmail;
    userRole;
    userAddress;
    userContactNumber;

    // Constructor
    constructor(id, name, role, address, contactNumber){
        this.userID = id;
        this.userName = name;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
        this.userContactNumber = contactNumber;
    }

    // Methods
    async buy(outfitId) {
        try{
        const results = await fitxchange.query('SELECT * FROM OUTFIT\
            where O_ID = ?', outfitId);
            if (results.length>0){
                console.log("Outfit is available: ", results[0]);
                return results[0];
            } else{
                console.log("Outfit not found");
                return null;
            }
            
        } catch (error){
            console.error("Error during purchase: ", error);
        }
    }

    // Take input from user to put the outfit
    async sell(outfitName, outfitColour, outfitSize, outfitDescription, itemCondition){
        try{
            const outfitID = generateUniqueId() // Generate a unique outfit ID
            const result = await fitxchange.query('INSERT INTO OUTFIT \
                (outfit_id, outfit_name, outfit_colour, outfit_size, outfit_description, item_condition, user_id)\
                VALUES (?, ?, ?, ?, ?, ?, ?)',
                [outfitID, outfitName, outfitColour, outfitSize, outfitDescription, itemCondition, this.userID]
            );

            // Add Categories
            for (const categoryId of categoryIds) {
                await fitxchange.query(
                    'INSERT INTO Outfit_and_Categories (outfit_id, category_id) Values (?, ?)',
                    [outfitID, categoryID]
                );
            }

            return {outfitID, message: "Outfit added successfully"};

        } catch (error){
            console.error("Error during sell: ", error);
            throw error;
        }
    }

    async addOutfit(outfitName, outfitColour, outfitSize, outfitDescription,itemCondition, categoryIds) {
        return this.sell(outfitName, outfitColour, outfitSize, outfitDescription, itemCondition, categoryIds)
    }

    async writeReview(outfitId, rating, comment) {
        try {
            const reviewId = generateUniqueId();
            const reviewDate = new Date();
            const result = await fitxchange.query(
                'INSERT INTO Review (review_id, outfit_id, user_id, review_date, rating, comment) \
                VALUES (?, ?, ?, ?, ?, ?)',
                [reviewId, outfitId, this.userID, reviewDate, rating, comment]
            );
            return result;
        } catch (error){
            console.error("Error writing review: ", error);
            throw error;
        }

    }
    // Export the User class (NEED IMPORT PATH TO SOLVE THE BUG)
    module.export = User;
}
 // Function to generate unique id
 function generateUniqueId(){
    return Math.random().toString(5).substring(2, 5)
 }