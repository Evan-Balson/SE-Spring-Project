// Get the functions in the db.js file to use
const db = require('./../services/db');

class Fashion_Advice {

    // Attributes
    fashion_Advice_ID;
    fashion_Advice_Content;
    date_Created;
    userID; 

    constructor(id,content,date,userId) {
        this.fashion_Advice_ID = id;
        this.fashion_Advice_Content = content;
        this.date_Created = date;
        this.userID = userId;
    }

    // Methods
    // gets the details of the fashion advice 
    async getFashionAdviceDetails(adviceID){
        try {

            // Selects the advice and creators name from the Fashion_Advice and Users table by joining
            var fashionAdviceSQL = 
            `SELECT
                f.advice_id,
                f.content,
                f.date_created,
                u.user_name
            FROM
                Fashion_Advice AS f
            JOIN
                Users AS u ON f.user_id = u.user_id
            WHERE
                f.advice_id = ?`
    
            // saves the result pf the db search into the variable result
            var result = await db.query(fashionAdviceSQL, [adviceID]);

            // checks if the result captured anything at all
            if (result.length > 0){
                // get the first row of advice from the query result
                const advice = result[0];
                // returning the object containing the advice details
                return{
                    id: advice.advice_id,
                    content: advice.content,
                    dateCreated: advice.date_created,
                    userID: advice.user_id
                };
            } else {
                // if the database query retuned no rows it returns null to indicate that
                return null;
            }
        } catch (error) {
            console.error("Error getting fashion advice details: ", error);
            throw error;
        }
    }

    // adding new fashion advice into the database
    async generateFashionAdvice(content, userID){
        try{
            var faSQL = 
            `INSERT INTO Fashion_Advice(
                content,
                date_created, 
                user_id)
            VALUES
                (?, CURDATE(), ?)`; // curdate() would get the current date
            
            // stores it into the result variable
            var result = await db.query (faSQL, [content, userID])
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
    Fashion_Advice
}