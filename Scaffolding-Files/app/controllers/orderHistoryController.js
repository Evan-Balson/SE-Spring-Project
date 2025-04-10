// controllers/orderHistoryController.js
const Transaction = require('../models/Transaction');

exports.getOrderHistory = async (req, res) => {
  try {
    // Retrieve filter criteria from query parameters:
    const user = req.session.activeUser;
    console.log(user.userID)
    const sortOrder = req.query.sortOrder || "12";  // default: past 12 months
    const searchQuery = req.query.search || "";

    let orders;
    // If a search string exists, use the searchTransactions method.
    if (searchQuery && searchQuery.trim() !== "") {
      orders = await Transaction.searchTransactions(user.userID, sortOrder, searchQuery);
    } else {
      orders = await Transaction.getAllTransactions(user.UserID);
    }

    // Render the order history page with the orders array.
    // (The view below expects an "orders" variable.)
    res.render('order-history', {
      title: 'Your Order History',
      orders: orders,
      sortOrder: sortOrder,
      searchQuery: searchQuery
    });
  } catch (err) {
    console.error('Error retrieving order history:', err);
    res.status(500).send('Internal Server Error');
  }
};
