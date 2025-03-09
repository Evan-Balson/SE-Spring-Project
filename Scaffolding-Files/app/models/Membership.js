
// Get the functions in the db.js file to use
const db = require('./../services/db');


class Membership{

    //attributes
    membership_ID;
    type;
    renewal_Status;
    start_Date;
    end_Date;
    Benefits;

    //constructor
    constructor(id, Type, renewal, start, end, benefits){
        this.membership_ID = id;
        this.type = Type;
        this.renewal_Status = renewal;
        this.start_Date = start;
        this.end_Date = end;
        this.Benefits = benefits;
    }

    //methods

    async getMembershipDetails(){
        try{
            const result = await db.query('SELECT * FROM MEMBERSHIP\
                WHERE membership_id = ?',this.membership_ID);
                if (result && result.length>0){
                    console.log("Membership is available: ", result[0]);
                    return result[0];
                } else{
                    console.log("Membership not found");
                    return null;
                }
                
            } catch (error){
                console.error("Error during membership: ", error);
                throw error;
            }
        }

    }
module.export = {
    Membership
} 