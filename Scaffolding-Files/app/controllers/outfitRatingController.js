// controllers/orderRatingController.js
const db = require('../services/db');

function generateID() {
  // Simple ID generator; replace with a proper UUID generator if needed.
  return 'R' + Math.floor(Math.random() * 1000000);
}

const submitRating = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ success: false, error: "Request body is missing" });
    }
    
    // Destructure expected properties from the request body.
    const { orderID, inventoryID, rating } = req.body;
    
    // Get the active user from the session.
    const activeUser = req.session.activeUser;
    if (!activeUser) {
      return res.status(401).json({ success: false, error: "User not logged in" });
    }
    const userID = activeUser.userID;
    
    // Debug logging to verify input values.
    console.log("submitRating received:", { orderID, inventoryID, rating, userID });
    
    // Check if a review already exists for this user and inventory item.
    const checkQuery = `
      SELECT Review_ID FROM Review
      WHERE Inventory_ID = ? AND User_ID = ?;
    `;
    const checkResults = await db.query(checkQuery, [inventoryID, userID]);
    console.log("Review check results:", checkResults);
    
    if (checkResults.length > 0) {
      // If a review exists, update it.
      const reviewID = checkResults[0].Review_ID;
      const updateQuery = `
        UPDATE Review
        SET Rating = ?, Review_Date = NOW()
        WHERE Review_ID = ?;
      `;
      const updateResult = await db.query(updateQuery, [rating, reviewID]);
      console.log("Review update result:", updateResult);
    } else {
      // Otherwise, insert a new review record.
      const reviewID = generateID();
      const insertQuery = `
        INSERT INTO Review (Review_ID, Inventory_ID, User_ID, Review_Date, Rating)
        VALUES (?, ?, ?, NOW(), ?);
      `;
      const insertResult = await db.query(insertQuery, [reviewID, inventoryID, userID, rating]);
      console.log("Review insert result:", insertResult);
    }
    
    res.json({ success: true, rating });
  } catch (err) {
    console.error("Error in submitRating:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { submitRating };
