const db = require('../services/db');
const path = require('path');

    // Show the form to create a new listing
    const showNewListingForm = (req, res) => {
        res.render('new-listing');
    };

    // Handle form submission for a new listing
    const submitListing = async (req, res) => {
        try {
            const { name, price, size, colors, description, quantity, condition } = req.body;
            const image = req.file;

            const userId = req.session.activeUser ? req.session.activeUser.userID : null;

            if (!req.session.activeUser) {
                return res.status(401).send('User not authenticated');
            }

            if (!name || !price || !description || !quantity || !condition || !size || !colors) {
                return res.status(400).send('Missing required fields');
            }

            if (!image) {
                return res.status(400).send('Please upload an image');
            }

            const imagePath = path.join('/images', image.filename);
            const inventoryId = `I${Date.now()}`;

            // Insert into Inventory table
            const inventoryQuery = `
                INSERT INTO Inventory (
                    Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const inventoryValues = [
                inventoryId,
                price,
                false, // Availability set by default
                quantity,
                name,
                colors,
                size,
                description,
                condition,
                userId,
                imagePath
            ];

            await db.query(inventoryQuery, inventoryValues);

            // Insert into Inspection table
            const inspectionQuery = `
                INSERT INTO Inspection (AUTH_ID, Inventory_ID, Verification_Date, Pass_Status)
                VALUES (?, ?, ?, ?)
            `;

            const authId = `A${Date.now()}`;
            const verificationDate = new Date().toISOString().split('T')[0];

            await db.query(inspectionQuery, [authId, inventoryId, verificationDate, 0]);

            return res.render('new-listing', {
                successMessage: `New listing with Inventory ID: ${inventoryId} has been added successfully. See Item Listing.`,
                inventoryId
            });
        } catch (error) {
            console.error('Error submitting listing: ', error);
            return res.status(500).send('Internal Server Error');
        }



        
    };

    const showUpdateListingPage = async (req, res) => {
        try {
        const inventoryID = req.params.id;
        const sql = "SELECT * FROM Inventory WHERE Inventory_ID = ?";
        const results = await db.query(sql, [inventoryID]);
        if (results.length === 0) {
            return res.status(404).send("Listing not found");
        }
        const item = results[0];
        res.render("update-listing", { title: "Update Listing", item });
        } catch (error) {
        console.error("Error displaying update listing page:", error);
        res.status(500).send("Internal Server Error");
        }
    };
    

    const showOutfitListing = async (req, res) => {
        try {
          const inventoryID = req.params.id;
          //console.log("Did the id show up?", inventoryID);
          
          // Fetch product details from Inventory table.
          const productQuery = "SELECT * FROM Inventory WHERE Inventory_ID = ?";
          const productResults = await db.query(productQuery, [inventoryID]);
          
          
          if (productResults.length === 0) {
            //console.log("Product not found for Inventory_ID:", inventoryID);
            return res.status(404).send("Product not found");
          }
          const product = productResults[0];
          //console.log("Product retrieved:", product);
          
          // Determine seller's user ID from the product record.
          const sellerID = product.User_ID; // Seller's ID stored in Inventory.
          //console.log("Seller ID:", sellerID);
          
          // Get the seller's average rating and total review count for their inventory.
          const ratingQuery = `
            SELECT AVG(Rating) AS avgRating, COUNT(*) AS totalReviews 
            FROM Review 
            WHERE Inventory_ID IN (SELECT Inventory_ID FROM Inventory WHERE User_ID = ?)
          `;
          const ratingResults = await db.query(ratingQuery, [sellerID]);
          //console.log("Rating query results:", ratingResults);
          
          // Ensure defaults in case no reviews exist.
          let avgRating = 0;
          let totalReviews = 0;
          if (ratingResults.length > 0 && ratingResults[0].avgRating !== null) {
            avgRating = parseFloat(ratingResults[0].avgRating);
            totalReviews = ratingResults[0].totalReviews;
          }
          //console.log("Computed avgRating:", avgRating, "totalReviews:", totalReviews);

          // Retrieve the active user from locals
          const user = req.session.activeUser || res.locals.activeUser;
          //console.log("The current user is: ", user);
          
          if(user.login_Status){
            // Render the outfit listing view with debugging values.
            res.render("outfit-listing", { 
                title: "Outfit Details", 
                product, 
                avgRating, 
                totalReviews 
            });
        }

          else{
            // Render the outfit listing view with debugging values.
          res.render("outfit-listing-logged-out", { 
            title: "Outfit Details", 
            product, 
            avgRating, 
            totalReviews 
          });
          }
          
        } catch (error) {
          console.error("Error in showOutfitListing:", error);
          res.status(500).send("Internal Server Error");
        }
      };

    const updateListing = async (req, res) => {
        try {
        const inventoryID = req.params.id;
        const { name, price, colors, size, quantity, condition, categories, description } = req.body;
        let imagePath;
        // If a new image has been uploaded, use it. Otherwise, leave the image as is.
        if (req.file) {
            imagePath = "/images/" + req.file.filename;
        }
        // Build the update query.
        let updateQuery = "UPDATE Inventory SET Name = ?, Price = ?, Color = ?, Size = ?, Quantity = ?, Condition_Level = ?, Description = ?, Categories = ?";
        const params = [name, price, colors, size, quantity, condition, description, categories];
        if (imagePath) {
            updateQuery += ", Product_Image_Path = ?";
            params.push(imagePath);
        }
        updateQuery += " WHERE Inventory_ID = ?";
        params.push(inventoryID);
        await db.query(updateQuery, params);
        res.redirect("/account");
        } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).send("Internal Server Error");
        };
    };

module.exports = {
    showNewListingForm,
    submitListing,
    showUpdateListingPage,
    updateListing,
    showOutfitListing
};
