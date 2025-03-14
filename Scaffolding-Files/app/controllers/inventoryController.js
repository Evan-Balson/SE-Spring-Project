const {Inventory} = require('../models/Inventory');

async function rentItem(req, res) {
    try{
        const inventoryId = req.params.id;
        const inventory = await Inventory.getInventoryByID(inventoryId);

        if (!inventory) {
            return res.status(404).json({message: 'Inventory item not found'});

        }
        const rented = await inventory.rent();
        if (rented) {
            res.status(200).json({message: 'Item rented successfully'});
        } else {
            res.status(400).json({message: 'Item not available or rent failed'});
        }
    } catch (error) {
        console.error('Error renting item:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}