const Payment_Method = require ('../models/Payment_Method').Payment_Method;
const db =require('../services/db');

exports.addPayment = async (req, res) => {
    try{ 
        const {paymentType, transactionId} = req.body;
        const paymentId = generateUniqueId();
        const paymentMethod = new Payment_Method(paymentId, paymentType, transactionId);
        const result = await paymentMethod.addPayment();

        if (result && result.affectedRows > 0) {
            res.status (201).json({message: "Payment method added successfully", paymentId: paymentId});
        } else {
            res.status(500).json({message: "Failed to add payment method"});
        }
    } catch (error) {
        console.error("Error adding payment method:", error);
        res.status(500).send(error.toString());
    }
};