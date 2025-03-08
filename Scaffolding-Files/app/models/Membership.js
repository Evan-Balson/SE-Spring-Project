
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

    async getMembershipDetails(){}

}

momdule.export = {
    Membership
} 