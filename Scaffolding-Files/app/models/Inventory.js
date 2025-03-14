import Outfit from './Outfit'
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inventory {

    // Attributes
    Inventory_ID;
    Price;
    isAvailable;
    quantity;
    outfit;


    constructor(id, price, availability, qty) {
        this.Inventory_ID = id;
        this.Price = price;
        this.isAvailable = availability;
        this.quantity = qty;
        this.outfit = Outfit;
    }

    // Methods
    
    async rent(){
        if (this.isAvailable && this.quantity>0){
            this.quantity--;
            if (this.quantity === 0) {
                this.isAvailable = false;
            }
            try {
                await db.query ('UPDATE Inventory SET quantity = ?, item_availability = ? WHERE inventory_id = ?' 
                [this.quantity, this.isAvailable, this.Inventory_ID]);
                return true; // Rent successful
            } catch (error) {
                console.error('Error renting item: ', error);
                return false; // Rent failed
            }
        }else {
            return false; // Item not available
        }
    }