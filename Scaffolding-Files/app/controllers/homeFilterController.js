const { Inventory } = require("../models/Inventory");

const filterItems = async (req, res) => {
  
// Get parameters from the request body
var minPrice =null;
var { sortOrder, category, maxPrice, location } = req.body;

if(maxPrice){minPrice=1;}
if(maxPrice==''){maxPrice=null;}

console.log("we are in this function");

console.log('Form data:', req.body); // To see what data you're receiving

// Check if only the sort filter is provided and the others are not
if (!sortOrder && !category && !location && !minPrice && !maxPrice) {
  console.log('empty room');
  return noFiltersSelected(req, res); // Default action when only sort is selected
}

// If there are filters, use a switch case to call the corresponding function
switch (true) {
  case !sortOrder && category && !location && !minPrice && !maxPrice:
    return sortByCategory(req, res, category); // Only category selected (no sort order)

  case !sortOrder && !category && location && !minPrice && !maxPrice:
    return sortByLocation(req, res, location); // Only location selected (no sort order)

  case !sortOrder && !category && !location && minPrice && maxPrice:
    return sortByPriceRange(req, res, minPrice, maxPrice); // Only price range selected (no sort order)

  case !sortOrder && category && location && !minPrice && !maxPrice:
    return sortByCategoryLocation(req, res, category, location); // Category + Location selected (no sort order)

  case !sortOrder && category && !location && minPrice && maxPrice:
    return sortByCategoryPriceRange(req, res, category, minPrice, maxPrice); // Category + Price Range selected (no sort order)

  case !sortOrder && !category && location && minPrice && maxPrice:
    return sortByLocationPriceRange(req, res, location, minPrice, maxPrice); // Location + Price Range selected (no sort order)

  case !sortOrder && category && location && minPrice && maxPrice:
    return sortByCategoryLocationPriceRange(req, res, category, location, minPrice, maxPrice); // Category + Location + Price Range selected (no sort order)


  // Newest sort order cases
  case sortOrder === 'newest' && !category && !location && !minPrice && !maxPrice:
    return sortByNewest(req, res); // No filters selected

  case sortOrder === 'newest' && category && !location && !minPrice && !maxPrice:
    return sortByNewestAndCategory(req, res, category); // Only category selected

  case sortOrder === 'newest' && !category && location && !minPrice && !maxPrice:
    return sortByNewestAndLocation(req, res, location); // Only location selected

  case sortOrder === 'newest' && !category && !location && minPrice && maxPrice:
    return sortByNewestAndPriceRange(req, res, minPrice, maxPrice); // Only price range selected (minPrice + maxPrice)

  case sortOrder === 'newest' && category && location && !minPrice && !maxPrice:
    return sortByNewestCategoryLocation(req, res, category, location); // Category + Location selected

  case sortOrder === 'newest' && category && !location && minPrice && maxPrice:
    return sortByNewestCategoryPriceRange(req, res, category, minPrice, maxPrice); // Category + Price Range selected (minPrice + maxPrice)

  case sortOrder === 'newest' && !category && location && minPrice && maxPrice:
    return sortByNewestLocationPriceRange(req, res, location, minPrice, maxPrice); // Location + Price Range selected (minPrice + maxPrice)

  case sortOrder === 'newest' && category && location && minPrice && maxPrice:
    return sortByNewestCategoryLocationPriceRange(req, res, category, location, minPrice, maxPrice); // Category + Location + Price Range selected (minPrice + maxPrice)


  // Oldest sort order cases
  case sortOrder === 'oldest' && !category && !location && !minPrice && !maxPrice:
    return sortByOldest(req, res); // No filters selected

  case sortOrder === 'oldest' && category && !location && !minPrice && !maxPrice:
    return sortByOldestAndCategory(req, res, category); // Only category selected

  case sortOrder === 'oldest' && !category && location && !minPrice && !maxPrice:
    return sortByOldestAndLocation(req, res, location); // Only location selected

  case sortOrder === 'oldest' && !category && !location && minPrice && maxPrice:
    return sortByOldestAndPriceRange(req, res, minPrice, maxPrice); // Only price range selected (minPrice + maxPrice)

  case sortOrder === 'oldest' && category && location && !minPrice && !maxPrice:
    return sortByOldestCategoryLocation(req, res, category, location); // Category + Location selected

  case sortOrder === 'oldest' && category && !location && minPrice && maxPrice:
    return sortByOldestCategoryPriceRange(req, res, category, minPrice, maxPrice); // Category + Price Range selected (minPrice + maxPrice)

  case sortOrder === 'oldest' && !category && location && minPrice && maxPrice:
    return sortByOldestLocationPriceRange(req, res, location, minPrice, maxPrice); // Location + Price Range selected (minPrice + maxPrice)

  case sortOrder === 'oldest' && category && location && minPrice && maxPrice:
    return sortByOldestCategoryLocationPriceRange(req, res, category, location, minPrice, maxPrice); // Category + Location + Price Range selected (minPrice + maxPrice)

  // Default action if no valid filter case is matched
  default:
    return noFiltersSelected(req, res);
}

}

// No filters selected
const noFiltersSelected = async (req, res) => {
  console.log("No filters selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayInventory(itemsPerPage, currentPage); // Default display of inventory
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    throw new Error('Error fetching inventory: ' + error.message);
  }
};

// Sort by Category
const sortByCategory = async (req, res, category) => {
  console.log("Category filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByCategory(category, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Category:', error.message);
    throw new Error('Error fetching inventory by Category: ' + error.message);
  }
};

// Sort by Location
const sortByLocation = async (req, res, location) => {
  console.log("Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByLocation(location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Location:', error.message);
    throw new Error('Error fetching inventory by Location: ' + error.message);
  }
};

// Sort by Price Range
const sortByPriceRange = async (req, res, minPrice, maxPrice) => {
  console.log("Price range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByPriceRange(minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Price Range:', error.message);
    throw new Error('Error fetching inventory by Price Range: ' + error.message);
  }
};

// Sort by Category + Location
const sortByCategoryLocation = async (req, res, category, location) => {
  console.log("Category and Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByCategoryLocation(category, location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Category and Location:', error.message);
    throw new Error('Error fetching inventory by Category and Location: ' + error.message);
  }
};

// Sort by Category + Price Range
const sortByCategoryPriceRange = async (req, res, category, minPrice, maxPrice) => {
  console.log("Category and Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Category and Price Range:', error.message);
    throw new Error('Error fetching inventory by Category and Price Range: ' + error.message);
  }
};

// Sort by Location + Price Range
const sortByLocationPriceRange = async (req, res, location, minPrice, maxPrice) => {
  console.log("Location and Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Location and Price Range:', error.message);
    throw new Error('Error fetching inventory by Location and Price Range: ' + error.message);
  }
};

// Sort by Category + Location + Price Range
const sortByCategoryLocationPriceRange = async (req, res, category, location, minPrice, maxPrice) => {
  console.log("Category, Location, and Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayByCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching inventory by Category, Location, and Price Range:', error.message);
    throw new Error('Error fetching inventory by Category, Location, and Price Range: ' + error.message);
  }
};

// Sort by Newest
const sortByNewest = async (req, res) => {
  console.log("Newest filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestInventory(itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest Inventory items:', error.message);
    throw new Error('Error fetching order by Newest Inventory items: ' + error.message);
  }
};

// Sort by Newest + Category
const sortByNewestAndCategory = async (req, res, category) => {
  console.log("Newest + Category filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestAndCategory(category, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Category Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Category Inventory items: ' + error.message);
  }
};

// Sort by Newest + Location
const sortByNewestAndLocation = async (req, res, location) => {
  console.log("Newest + Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestAndLocation(location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Location Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Location Inventory items: ' + error.message);
  }
};

// Sort by Newest + Price Range
const sortByNewestAndPriceRange = async (req, res, minPrice, maxPrice) => {
  console.log("Newest + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestAndPriceRange(minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Price Range Inventory items: ' + error.message);
  }
};

// Sort by Oldest
const sortByOldest = async (req, res) => {
  console.log("Oldest filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestInventory(itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Category
const sortByOldestAndCategory = async (req, res, category) => {
  console.log("Oldest + Category filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestAndCategory(category, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Category Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Category Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Location
const sortByOldestAndLocation = async (req, res, location) => {
  console.log("Oldest + Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestAndLocation(location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Location Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Location Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Price Range
const sortByOldestAndPriceRange = async (req, res, minPrice, maxPrice) => {
  console.log("Oldest + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestAndPriceRange(minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Price Range Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Category + Location + Price Range
const sortByOldestCategoryLocationPriceRange = async (req, res, category, location, minPrice, maxPrice) => {
  console.log("Oldest + Category + Location + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Category + Location + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Category + Location + Price Range Inventory items: ' + error.message);
  }
  
};

// Sort by Newest + Category + Location
const sortByNewestCategoryLocation = async (req, res, category, location) => {
  console.log("Newest + Category + Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestCategoryLocation(category, location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Category + Location Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Category + Location Inventory items: ' + error.message);
  }
};

// Sort by Newest + Category + Price Range
const sortByNewestCategoryPriceRange = async (req, res, category, minPrice, maxPrice) => {
  console.log("Newest + Category + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Category + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Category + Price Range Inventory items: ' + error.message);
  }
};

// Sort by Newest + Location + Price Range
const sortByNewestLocationPriceRange = async (req, res, location, minPrice, maxPrice) => {
  console.log("Newest + Location + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Location + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Location + Price Range Inventory items: ' + error.message);
  }

};

// Sort by Newest + Category + Location + Price Range
const sortByNewestCategoryLocationPriceRange = async (req, res, category, location, minPrice, maxPrice) => {
  console.log("Newest + Category + Location + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayNewestCategoryLocationPriceRange(category, location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Newest + Category + Location + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Newest + Category + Location + Price Range Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Category + Location
const sortByOldestCategoryLocation = async (req, res, category, location) => {
  console.log("Oldest + Category + Location filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestCategoryLocation(category, location, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Category + Location Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Category + Location Inventory items: ' + error.message);
  }

};

// Sort by Oldest + Category + Price Range
const sortByOldestCategoryPriceRange = async (req, res, category, minPrice, maxPrice) => {
  console.log("Oldest + Category + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestCategoryPriceRange(category, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Category + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Category + Price Range Inventory items: ' + error.message);
  }
};

// Sort by Oldest + Location + Price Range
const sortByOldestLocationPriceRange = async (req, res, location, minPrice, maxPrice) => {
  console.log("Oldest + Location + Price Range filter selected");

  try {
    const currentPage = parseInt(req.query.page) || 1;
    const itemsPerPage = 4;
    const inventoryItems = await Inventory.displayOldestLocationPriceRange(location, minPrice, maxPrice, itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
    console.error('Error fetching order by Oldest + Location + Price Range Inventory items:', error.message);
    throw new Error('Error fetching order by Oldest + Location + Price Range Inventory items: ' + error.message);
  }
};


module.exports = {
  filterItems,
  noFiltersSelected,
  sortByCategory,
  sortByLocation,
  sortByPriceRange,
  sortByCategoryLocation,
  sortByCategoryPriceRange,
  sortByLocationPriceRange,
  sortByCategoryLocationPriceRange,
  sortByNewest,
  sortByNewestAndCategory,
  sortByNewestAndLocation,
  sortByNewestAndPriceRange,
  sortByNewestCategoryLocation,
  sortByNewestCategoryPriceRange,
  sortByNewestLocationPriceRange,
  sortByNewestCategoryLocationPriceRange,
  sortByOldest,
  sortByOldestAndCategory,
  sortByOldestAndLocation,
  sortByOldestAndPriceRange,
  sortByOldestCategoryLocation,
  sortByOldestCategoryPriceRange,
  sortByOldestLocationPriceRange,
  sortByOldestCategoryLocationPriceRange
};


