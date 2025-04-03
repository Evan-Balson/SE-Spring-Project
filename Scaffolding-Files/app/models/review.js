
// Get the functions in the db.js file to use
const db = require('./../services/db');


class review{

    //attributes
    review_ID;
    review_Date;
    rating;
    review_comment;

    //constructor
    constructor(id,date, rate, comment){
        this.review_ID = id;
        this.review_Date = date;
        this.rating = rate;
        this.review_comment = comment;
    }

    //methods

    async getMembershipDetails(){}

}

momdule.export = {
    review
} 