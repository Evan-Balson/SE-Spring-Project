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
async function returnItem(req, res) {
    try {
        const inventoryId = req.params.id;
        const inventory = await Inventory.getInventoryById(inventoryId);

        if (!inventory){
            return res.status(404).json({message: 'Inventory item not found'});
        }
        const returned = await inventory.return();

        if (returned) {
            res.status(200).json({message: 'Item returned successfully'});
        } else {
            res.status(500).json({message: 'Return failed'});
        }
    } catch (error) {
        console.error('Error returning item:', error);
        res.status(500).json({message: 'Internal server error'});
    }
}

async function displayInventory(req, res){
    try{
        const inventoryId = req.params.id;
        const inventory =await Inventory.getInventoryByID(inventoryId);

        if (!inventory) {
            return res.status(404).json({message: 'Inventory item not found'});
        }
        const inventoryDetails = await inventory.displayInventory();

        if (inventoryDetails) {
            res.status(200).json(inventoryDetails);
        } else {
            res.status(500).json({message: 'Failed to display inventory details'});
        }
    } catch (error) {
        console.error('Error displaying inventory: ', error);
        res.status(500).json({message: 'Internal server error'});
    }
}
