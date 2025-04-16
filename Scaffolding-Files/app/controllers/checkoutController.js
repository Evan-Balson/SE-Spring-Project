const { Cart } = require('../models/Cart');
const {Transaction} = require('../models/Transaction');
const {Payment} = require('../models/Payment');
const db = require('../services/db');

const getCheckout = async (req, res) => {
    try {

        const userId = req.session.activeUser.userID;
        console.log("Checkout User ID:", userId);
        console.log("Session Data:", req.session);

        // Fetch cart items for the user
        const cartItems = await Cart.getCheckoutDetails(userId);

        return cartItems
    } catch (error) {
        console.error('Error fetching checkout items:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const processCheckout = async (req, res) => {
  try {
    const activeUser = req.session.activeUser;
    if (!activeUser || !activeUser.login_Status) {
      return res.redirect("/login");
    }

    // Retrieve the Payment_ID for the active user.
    const paymentResults = await Payment.getUserPayment(activeUser.userID);
    if (!paymentResults || paymentResults.length === 0) {
      console.error("No payment record found for user:", activeUser.userID);
      return res.status(400).send("No payment information found for your account.");
    }
    const paymentID = paymentResults[0].Payment_ID;
    
    // Retrieve cart items with only Inventory details.
    const cartItems = await Cart.getCheckoutDetails(activeUser.userID);
    if (!cartItems || cartItems.length === 0) {
      console.log("Checkout: Cart is empty for user:", activeUser.userID);
      return res.redirect("/cart");
    }

    console.log("Checkout: Cart for user:", cartItems);

    for (const item of cartItems) {
      // Generate a unique Transaction_ID (replace with a proper UUID if needed)
      const transactionID = "T" + Date.now() + "_" + item.Cart_ID;
      const transactionDate = new Date();

      // Calculate the total price for this cart item.
      // Here, we use item.Price (from Inventory) * item.Quantity (from Cart).
      const totalPrice = (item.Price || 0) * (item.Quantity || 1);

      // Build transaction data object.
      const transactionData = {
        transactionID: transactionID,
        Payment_ID: paymentID ?? 1,
        transactionDate: transactionDate,
        totalPrice: totalPrice ?? 0,
        userID: activeUser.userID,
        inventoryID: item.inventoryID}
    

      console.log("Processing checkout for cart item:", transactionData);

      // Create the transaction record.
      await Transaction.newTransaction(transactionData);

      // Update the Inventory: reduce available quantity.
      const updateInventoryQuery = "UPDATE Inventory SET Quantity = Quantity - ? WHERE Inventory_ID = ?";
      await db.query(updateInventoryQuery, [item.Quantity, item.inventoryID]);

      // Remove the cart item after successful processing.
      await Cart.deleteCartItem(item.Cart_ID);
    }

    console.log("Checkout completed for user:", activeUser.userID);
    res.redirect("/account");
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
    getCheckout,
    processCheckout
};
