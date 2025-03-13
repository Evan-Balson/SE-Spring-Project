
// Get the functions in the db.js file to use
const db = require('./../services/db');


class review{

    //attributes
    review_ID;
    review_Date;
    rating;
    review_comment;
    userID;

    //constructor
    constructor(id,date, rate, comment){
        this.review_ID = id;
        this.review_Date = date;
        this.rating = rate;
        this.review_comment = comment;
        this.userID = this.userID;
    }

    //methods
    async getReview(){
        try{
            const [row] =await db.query('SELECT * FROM WHERE review_id=?', [this.review_ID]);
                if (row && row.length >0){
                    console.log("Review found: ", row[0]);
                    return row[0]; // Return the review object
                } else{
                    console.log("Review not found");
                    return null; // Return null if not found
                }
                
            } catch (error){
                console.error("Error during adding review: ", error);
                throw error;
            }
        }

    //add review
    async addReview(){
        try{
            const [result] = await db.query('INSERT INTO REVIEW (review_date, rating, comment, this.userID\
                VALUES (?, ?, ?, ?)',
            [this.review_Date, this.rating, this.review_comment, this.userID]);
            if (result && result.affectedRows > 0) {
                console.log("Review added successfully");
                return true;
            } else {
                console.log("Failes to add review");
                return false;
            }
        } catch(error){
            console.error("Error during adding review: ", error);
            throw null;
        }
    }
}
module.exports = {
    review
} 