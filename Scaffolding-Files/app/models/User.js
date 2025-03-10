import Payment from './Payment'

// Get the functions in the db.js file to use
const db = require('./../services/db');

class User extends IUserManagement{

    // Attributes
    userID;
    userName;
    userEmail;
    userPassword;
    userRole;
    userAddress;
    paymentMethod;


    // Constructor
    constructor(id,name,email,password,role,address) {
        this.userID = id;
        this.userName = name;
        this.userEmail = email;
        this.userPassword = password;
        this.userRole = role;
        this.userAddress = address;
        // using aggregation to create an intance of payment method.
        this.paymentMethod = new Payment();

    }

    // Methods
    async buy(outfitId) {
        try{
            const [results] = await db.query('SELECT * FROM Outfit\
                where outfit_id = ?', [outfitId]);
                if (results && results.length>0){
                    console.log("Outfit is available: ", results[0]);
                    return results[0];
                } else{
                    console.log("Outfit not found");
                    return null;
                }
                
            } catch (error){
                console.error("Error during purchase: ", error);
                throw error;
            }
        }
    
    
    async sell(outfitName, outfitColor, outfitSize, outfitDescription, itemCondition, categoryIds) {
            try{
                const outfitID = generateUniqueId() // Generate a unique outfit ID
                // Add outfit
                const [result] = await db.query('INSERT INTO Outfit \
                    (outfit_id, outfit_name, outfit_color, outfit_size, outfit_description, item_condition, user_id)\
                    VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [outfitID, outfitName, outfitColor, outfitSize, outfitDescription, itemCondition, this.userID]
                );
    
                // Add Categories
                for (const categoryId of categoryIds) {
                    await db.query(
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

    async writeReview(outfitId, rating, comment){
        try {
            const reviewId = generateUniqueId();
            const reviewDate = new Date().toISOString().split('T')[0]; // Format date fro SQL
            const [result] = await db.query(
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
}

function generateUniqueId() {
    return Math.random().toString(5).substring(2, 5);
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.export = {
    User
}