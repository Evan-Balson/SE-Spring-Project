import category from './category'
import review from './review'

// Get the functions in the db.js file to use
const db = require('./../services/db');

class Outfit {

    // Attributes
    outfit_ID;
    outfit_Name;
    outfit_Color;
    outfit_Size;
    outfit_Description;
    outfit_Condition;
    outfit_Category;
    review;


    // Constructor

    constructor(id,name,color,size,description,condition) {
        this.outfit_ID = id;
        this.outfit_Name = name;
        this.outfit_Color = color;
        this.outfit_Size = size;
        this.outfit_Description = description;
        this.outfit_Condition = condition;
        this.outfit_Category = category;
        this.review = review;
    }

    // Methods
    
    async getOutfit_ID(){
        return this.outfit_ID;
    }
    async getOutfit_Name(){
        return this.outfit_Name;
    }
    async getOutfit_Color(){
        return this.outfit_Color;
    }
    async getOutfit_Size(){
        return this.outfit_Size;
    }
    async getOutfit_Description(){
        return this.outfit_Description;
    }
    async getOutfit_Condition(){
        return this.outfit_Condition;
    }
    async getOutfit_Category(){
        return this.outfit_Category;
    }
    async geOutfit_Review(){
        return this.review;
    }

    async setOutfit_Review(r_id ,date, rate, comment){
        review = new review(r_id ,date, rate, comment);
        review.addReview();
    }

}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Outfit
}