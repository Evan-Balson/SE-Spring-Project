//import Outfit from './Outfit'
// Get the functions in the db.js file to use
const db = require('./../services/db');

class Inventory {

    // Attributes
    Inventory_ID;
    Price;
    isAvailable;
    quantity;
    outfit;


    constructor(id, price, availability, qty) {
        this.Inventory_ID = id;
        this.Price = price;
        this.isAvailable = availability;
        this.quantity = qty;
        this.outfit = Outfit;
    }

    // Methods
    
    async rent(){}
    async return(){}


    static async getMyInventoryItems(userID) {
        const query = "SELECT Inventory_ID, Price, Availability, Quantity, Name, Color, Size, Description, Condition_Level, User_ID, Product_Image_Path FROM Inventory WHERE User_ID = ? ORDER BY Name ASC;";
        const results = await db.query(query, [userID]);
        return results;
      }


static async displayinventoryItem(id) {
    // Use parameterized queries to prevent SQL injection
    const sql = "SELECT * from Inventory WHERE Inventory_ID = ?";

    try {
        const result = await db.query(sql, [id]);  // Pass `id` as an array to avoid direct interpolation
        console.log(result);  // Check the result object structure
        return result[0];  // Return the first row (product) if found
    } catch (error) {
        console.error("Error fetching inventory item:", error);
        throw error;
    }
}

// No filters selected
static async displayInventory(itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    // Query the database
    var sql = `
    SELECT 
        Inventory.*, 
        Inspection.Verification_Date
    FROM 
        Inventory
    INNER JOIN 
        Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID
    WHERE 
        Inspection.Pass_Status = true
    LIMIT ${itemsPerPage + 1} OFFSET ${offset}
`;

    try {
        var results = await db.query(sql);
       

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }
        //console.log(results);

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}
  
// Sort by Category
static async displayByCategory(category, itemsPerPage, currentPage) {
    //console.log(category);
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql,[category]);
        console.log("this is the sql result: ", results);
        

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }
        //console.log(results);

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}

  
  // Sort by Location
static async displayByLocation(location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `
    SELECT 
        Inventory.*, 
        Inspection.Verification_Date,
        User.Address
    FROM 
        Inventory
    INNER JOIN 
        Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID
    INNER JOIN 
        User ON Inventory.User_ID = User.User_ID
    WHERE 
        Inspection.Pass_Status = true
        AND User.Address = ? 
    ORDER BY 
        Inspection.Verification_Date DESC
    LIMIT ${itemsPerPage + 1} OFFSET ${offset}
`;

    try {
        var results = await db.query(sql,[location]);
       

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }
        //console.log(results);

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}
      
  
  // Sort by Price Range
static async displayByPriceRange(minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
            const offset = (currentPage - 1) * itemsPerPage;
            itemsPerPage = itemsPerPage + 1;
    
            var sql = "SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT " + itemsPerPage + " OFFSET " + offset + ";";

            var params = [minPrice, maxPrice];
    
            try {
                var results = await db.query(sql, params);
               
    
                // Determine if there's a next or previous page
                const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
                const prevPage = currentPage > 1 ? currentPage - 1 : null;
    
                // If there are more than the itemsPerPage, pop the extra item
                if (results.length === itemsPerPage + 1) {
                    results.pop();
                }
                //console.log(results);
    
                return {
                    results,
                    nextPage,
                    prevPage
                };
            } catch (error) {
                console.error("Error fetching inventory:", error);
                throw error;
            }
}
  
// Sort by Category + Location
static async displayByCategoryLocation(category, location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, location]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory by category and location:", error);
        throw error;
    }
}

// Sort by Category + Price Range
static async displayByCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory by category and price range:", error);
        throw error;
    }
}

// Sort by Location + Price Range
static async displayByLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory by location and price range:", error);
        throw error;
    }
}

// Sort by Category + Location + Price Range
static async displayByCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching inventory by category, location, and price range:", error);
        throw error;
    }
}

  
// Sort by Newest
static async displayNewestInventory(itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID WHERE Inspection.Pass_Status = true ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

    try {
        console.log("this is printing the newest entries first.");
        var results = await db.query(sql);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory:", error);
        throw error;
    }
}

// Sort by Newest + Category
static async displayNewestAndCategory(category, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by category:", error);
        throw error;
    }
}

// Sort by Newest + Location
static async displayNewestAndLocation(location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND User.Address = ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [location]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by location:", error);
        throw error;
    }
}
 
// Sort by Newest + Price Range
static async displayNewestAndPriceRange(minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID WHERE Inspection.Pass_Status = true AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by price range:", error);
        throw error;
    }
}

// Sort by Newest + Category + Location
static async displayNewestCategoryLocation(category, location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, location]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by category and location:", error);
        throw error;
    }
}

// Sort by Newest + Category + Price Range
static async displayNewestCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

    try {
        var results = await db.query(sql, [category, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by category and price range:", error);
        throw error;
    }
}

// Sort by Newest + Location + Price Range
static async displayNewestLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

    try {
        var results = await db.query(sql, [location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by location and price range:", error);
        throw error;
    }
}

// Sort by Newest + Category + Location + Price Range
static async displayNewestCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date DESC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching newest inventory by category, location, and price range:", error);
        throw error;
    }
}

// Sort by Oldest
static async displayOldestInventory(itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID WHERE Inspection.Pass_Status = true ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory:", error);
        throw error;
    }
}

// Sort by Oldest + Category
static async displayOldestAndCategory(category, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory filtered by category:", error);
        throw error;
    }
}

  
// Sort by Oldest + Location
static async displayOldestAndLocation(location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND User.Address = ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

    try {
        var results = await db.query(sql, [location]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by location:", error);
        throw error;
    }
}

// Sort by Oldest + Price Range
static async displayOldestAndPriceRange(minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID WHERE Inspection.Pass_Status = true AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by price range:", error);
        throw error;
    }
}

// Sort by Oldest + Category + Location + Price Range
static async displayOldestCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.USER_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by category, location, and price range:", error);
        throw error;
    }
}
 
  
// Sort by Oldest + Category + Location
static async displayOldestCategoryLocation(category, location, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND User.Address = ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;

    try {
        var results = await db.query(sql, [category, location]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by category and location:", error);
        throw error;
    }
}

// Sort by Oldest + Category + Price Range
static async displayOldestCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN Outfit_and_Categories ON Inventory.Inventory_ID = Outfit_and_Categories.Inventory_ID INNER JOIN Category ON Outfit_and_Categories.Category_ID = Category.Category_ID WHERE Inspection.Pass_Status = true AND Category.Category_Name = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [category, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by category and price range:", error);
        throw error;
    }
}

// Sort by Oldest + Location + Price Range
static async displayOldestLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage) {
    // Calculate the OFFSET for pagination
    const offset = (currentPage - 1) * itemsPerPage;

    var sql = `SELECT Inventory.*, Inspection.Verification_Date, User.Address FROM Inventory INNER JOIN Inspection ON Inventory.Inventory_ID = Inspection.Inventory_ID INNER JOIN User ON Inventory.User_ID = User.User_ID WHERE Inspection.Pass_Status = true AND User.Address = ? AND Inventory.Price BETWEEN ? AND ? ORDER BY Inspection.Verification_Date ASC LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;


    try {
        var results = await db.query(sql, [location, minPrice, maxPrice]);

        // Determine if there's a next or previous page
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;

        // If there are more than the itemsPerPage, pop the extra item
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        return {
            results,
            nextPage,
            prevPage
        };
    } catch (error) {
        console.error("Error fetching oldest inventory by location and price range:", error);
        throw error;
    }
}


    
}
// needed to  export functions, objects, or other values from a module so they can be imported and used in other files.
module.exports = {
    Inventory
}