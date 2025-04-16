const {Transaction} = require('../models/Transaction');

const getOrderHistory = async (req, res) => {
  try {
    const user = req.session.activeUser;  // Ensure activeUser is set in the session
    console.log("Active user:", user.userID);

    // Get sort order and search query from request query parameters (for GET requests)  
    // or from the body (for POST requests) as appropriate.
    const sortOrder = req.method === 'GET' ? req.query.sortOrder || "*" : req.body.sortOrder || "*";
    const searchQuery = req.method === 'GET' ? req.query.search || "" : req.body.search || "";

    let orders;
    // If a search query exists, use the searchTransactions method.
    if (searchQuery && searchQuery.trim() !== "") {
      orders = await Transaction.searchTransactions(user.userID, sortOrder, searchQuery);
      console.log(user.userID, sortOrder, searchQuery);
      console.log(orders);
    } else {
      orders = await Transaction.getAllTransactions(user.userID, sortOrder);
      console.log(orders);
      console.log(sortOrder);
    }

    // Render the order history page.
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

module.exports ={
  getOrderHistory
}