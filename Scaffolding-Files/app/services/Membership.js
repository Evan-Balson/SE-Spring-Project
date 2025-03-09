import User from './Membership';
require ("dotenv").config()  // Load environmet variables

// Import database connection module
const fitxchange = require('./../services/db');

class Membership{
    membership_ID;
    Type;
    Renewal_Status;
    Start_Date;
    End_Date;
    Benefits;

    constructor(id, type, status, start_Date, end_Date, benefits){
        this.membership_ID = id;
        this.Type = type;
        this.Renewal_Status = status;
        this.Start_Date = start_Date;
        this.End_Date= end_Date;
        this.Benefits= benefits;
    }

    // Method
    async type (){
        try{
            const result = await fitxchange.query('SELECT * FROM MEMBERSHIP\
                WHERE membership_id = ?', this.membership_ID);
                if (result && result.length>0){
                    console.log("Membership is available: ", result[0]);
                    return results[0];
                } else{
                    console.log("Membership not found");
                    return null;
                }
                
            } catch (error){
                console.error("Error during membership: ", error);
                return null;
            }
        }
    }
    module.export = Membership;