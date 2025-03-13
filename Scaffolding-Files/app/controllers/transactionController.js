const {Transaction} = require('../models/Transaction');

async function creatTransaction(req, res){
    try{
        const { transaction_id, transaction_date, total, user_id} = req.body;
        
        if(!transaction_id || !transaction_date || !total, user_id){
            return res.status(400).json({message: 'Missing required fields'});
        }
        const transaction = new Transaction(transaction_id, transaction_date, total, user_id);
        const result = await transaction.newTransaction();

        if (result) {
            res.status(201).json({ message: 'Transaction created successfully', result});
        } else {
            res.status(500).json({message: 'Failed to create transaction'});
        }
    } catch (error) {
        console.error('Error creating transaction: ', error);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
}
async function checkInventory(req, res) {
    try {
        const {transaction_id, transaction_date, total, user_id} = req.body;
        const transaction = new Transaction(transaction_id, transaction_date, total, user_id);
        await transaction.checkInventory();
        res.status(200).json({ message: 'Internal server error', error: error.message});

    } catch (error) {
        console.error('Error checking inventory:', error);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }
}
