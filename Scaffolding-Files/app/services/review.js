require ("dotenv").config()  // Load environmet variables

// Import database connection module
const fitxchange = require('./db');

class review{
    Date;
    Rating;
    Comment;
    userID;

    constructor(date, rate, comment){
        this.Date =date;
        this.Rating= rate;
        this.Comment= comment;
        this.userID = userID;
    }

    // Method
    async writeReview(){
        try{
            const [result] =await fitxchange.query('INSERT INTO REVIEW \
                (Date, Rating, Comment, userId)\
                VALUES (?, ?, ?, ?)',
                [date, rate, comment, userID]
                );
                if (result && result.affectedRows>0){
                    console.log("Review is available: ", result[0]);
                    return true;
                } else{
                    console.log("Review not found");
                    return false;
                }
                
            } catch (error){
                console.error("Error during adding review: ", error);
                return false;
            }
        }

    async readReview(){
        try{
        const [rows] = await fitxchange.query('SELECT * FROM REVIEW')
        return rows; // Return the array of reviews
        } catch(error){
            console.error("Error during reading reviews: ", error);
            return null; // Return null on error
        }
    }
}
    module.exports = review;