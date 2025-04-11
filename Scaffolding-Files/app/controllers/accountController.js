const { User } = require("../models/User");
const { Transaction } = require("../models/Transaction");
const { Favourites } = require("../models/favourites");
const { Inventory} = require("../models/Inventory");

const getAccountPage = async (req, res) => {
  try {
    const user = req.session.activeUser;
    console.log(user);
    // Ensure these functions always return an array, even if empty.
    const transactions = await Transaction.getRecentTransactions(user.userID) || [];
    const favorites = await Favourites.getRecentFavorites(user.userID) || [];
    const inventoryItems = await Inventory.getMyInventoryItems(user.userID) || [];
    console.log(inventoryItems);
    
    // Render the account view with user, transactions, and favorites data.
    res.render("account", { title: "My Account", user, transactions, favorites, inventoryItems });
  } catch (error) {
    console.error("Error loading account page:", error);
    res.status(500).send("Internal Server Error");
  }
};

const updateAccount = async (req, res) => {
  try {
    const userId = req.session.activeUser.userID;
    const updatedData = {
      userName: req.body.userName,
      userEmail: req.body.userEmail,
      // Add additional fields if needed
    };
    await User.updateUser(userId, updatedData);
    // Refresh the session user data (assuming a findById exists)
    req.session.activeUser = await User.findById(userId);
    res.redirect("/account");
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getAccountPage, updateAccount };
