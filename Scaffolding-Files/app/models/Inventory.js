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
                await db.query ('UPDATE Inventory SET quantity = ?item_availability = ? WHERE inventory_id = ?' 
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
    async return(){
        this.quantity++;
        this.isAvailable = true;
        try{
            await db.query('UPDATE Inventory SET quantity = ? , item_availability = ? WHERE inventory_id =?',
                [this.quantity, this.isAvailable, this.Inventory_ID]);
                return true; // Return successful
        } catch (error) {
            console.error('Error returning item: ', error);
            return false; // Return failed
        }
    }
    async displayinventory(){
        try {
            const [rows] = await db.query ('SELECT * FROM Inventory WHERE inventory_id=?', [this.Inventory_ID]);
            if (rows.length > 0) {
                const inventoryData = rows[0];
                console.log('Inventory Details:');
                console.log('Inventory ID: ${inventoryData.inventory_id}');
                console.log('Price: ${inventoryData.price}');
                console.log('Availability: ${inventoryData.item_availability}');
                console.log('Quantity: ${inventoryData.quantity}');

                const outfit = new Outfit(this.outfit.outfit_id, this.outfit.outfit_name, this.outfit.outfit_color, this.outfit.outfit_size, this.outfit.outfit_description, this.outfit.item_condition, this.outfit.user_id);
                await outfit.displayOutfit();
                return inventoryData;
            } else {
                console.log('Inventory not found.');
                return null;
            }        
        } catch (error) {
            console.error('Error displaying inventory: ', error);
            return null;
        }
    }
}

// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inventory
}