const { Inventory } = require("../models/Inventory");

const filterItems = async (req, res) => {

  const { sortOrder, category, price, location } = req.body;

  
  console.log('Form data:', req.body); // To see what data you're receiving

  // Check if only the sort filter is provided and the others are not
  if (!sortOrder && !category && !location && !price) {
    console.log('empty room');
    return noFiltersSelected(req, res); // Default action when only sort is selected
  }
  
    // If there are filters, use a switch case to call the corresponding function
    switch (true) {
      case sortOrder === 'newest':
        return sortByNewest(req, res);
      case sortOrder === 'oldest':
        return sortByOldest(req, res);
      case category:
        return sortByCategory(req, res);
      case location:
        return sortByLocation(req, res);
      case price:
        return sortByPrice(req, res);
      case sort === 'newest' && category:
        return sortByOrderAndCategory(req, res);
      case sort === 'newest' && location:
        return sortByOrderAndLocation(req, res);
      case sort === 'newest' && price:
        return sortByOrderAndPrice(req, res);
      case category && location:
        return sortByCategoryAndLocation(req, res);
      case category && price:
        return sortByCategoryAndPrice(req, res);
      case location && price:
        return sortByLocationAndPrice(req, res);
      case sort === 'newest' && category && location:
        return sortByOrderCategoryLocation(req, res);
      case sort === 'newest' && category && price:
        return sortByOrderCategoryPrice(req, res);
      case sort === 'newest' && location && price:
        return sortByOrderLocationPrice(req, res);
      case category && location && price:
        return sortByCategoryLocationPrice(req, res);
      default:
        return noFiltersSelected(req, res); // Default action, in case no valid case is matched
    }
  };
  

const sortByNewest = async (req, res) => {

  try {

    //console.log(activeUser)
    const currentPage = parseInt(req.query.page) || 1; // Get the page number from the query or default to 1
    const itemsPerPage = 4; // Number of items per page

    // Get inventory items based on the page
    const inventoryItems = await Inventory.displayNewestinventory(itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
      // Log and rethrow the error to be handled in the route
      console.error('Error fetching general inventory items:', error.message);
      throw new Error('Error fetching general inventory items: ' + error.message);
  }
};
const sortByOldest = async (req, res) => {console.log("ON");};
const sortByCategory = async (req, res) => {console.log("sC");};
const sortByLocation = async (req, res) => {console.log("sL");};
const sortByPrice = async (req, res) => {console.log("sP");};
const sortByOrderAndCategory = async (req, res) => {console.log("sBOC");};
const sortByOrderAndLocation = async (req, res) => {console.log("sBOL");};
const sortByOrderAndPrice = async (req, res) => {console.log("sBOP");};
const sortByCategoryAndLocation = async (req, res) => {console.log("sP");};
const sortByCategoryAndPrice = async (req, res) => {console.log("sP");};
const sortByLocationAndPrice = async (req, res) => {console.log("sP");};
const sortByOrderCategoryLocation = async (req, res) => {console.log("sP");};
const sortByOrderCategoryPrice = async (req, res) => {console.log("sP");};
const sortByOrderLocationPrice = async (req, res) => {console.log("sP");};
const sortByCategoryLocationPrice = async (req, res) => {console.log("sP");};

// working module: Displays general Items
const noFiltersSelected = async (req, res) => {
  console.log("no filters")

  try {

      //console.log(activeUser)
    const currentPage = parseInt(req.query.page) || 1; // Get the page number from the query or default to 1
    const itemsPerPage = 4; // Number of items per page

    // Get inventory items based on the page
    const inventoryItems = await Inventory.displayinventory(itemsPerPage, currentPage);
    
    return inventoryItems;

  } catch (error) {
      // Log and rethrow the error to be handled in the route
      console.error('Error fetching general inventory items:', error.message);
      throw new Error('Error fetching general inventory items: ' + error.message);
  }
  ;};


module.exports = {
    sortByNewest,
    sortByOldest,
    sortByCategory,
    sortByLocation,
    sortByPrice,
    sortByOrderAndCategory,
    sortByOrderAndLocation,
    sortByOrderAndPrice,
    sortByCategoryAndLocation,
    sortByCategoryAndPrice,
    sortByLocationAndPrice,
    sortByOrderCategoryLocation,
    sortByOrderCategoryPrice,
    sortByOrderLocationPrice,
    sortByCategoryLocationPrice,
    noFiltersSelected,
    filterItems
  };
  