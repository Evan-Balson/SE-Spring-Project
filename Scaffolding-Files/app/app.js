// Import express.js
const express = require("express");
const multer = require('multer');
const path = require('path');
const cookieParser = require("cookie-parser");
const compression = require("compression");
require('dotenv').config();

// For node-nlp
const { NlpManager } = require('node-nlp');
// import express-session so that we can track user login status site-wide
const session = require("express-session");

//our AI modules & Models
const { getRelevantKeywords, getSQLStatementsFromKeywords,processUserMessage } = require('./chatBot/gptHelper');
const ChatBot = require('./chatBot/chatBot');

// Create express app
var app = express();

// Set up session middleware
app.use(session({
    secret: 'z1x2c3v4b5n6m7a8s9d',  // Use a strong, random secret key
    resave: false,
    saveUninitialized: true
}));

// Configure storage for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './app/public/images/');  // Directory where files should be stored
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


// Static files location
app.use(express.static("./app/public"));

app.use(express.json());
/* included the parser so that it can read the page json forms
For URL-encoded data, we will use express.urlencoded() middleware:
Usage - landing page */ 
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression());


// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');


// Get the functions in the db.js file to use
const db = require('./services/db');

// Initialize node-nlp manager and train model
const manager = new NlpManager({ languages: ['en'] });
const myBot = new ChatBot(manager);
//myBot.trainModel(); //-- already trained (if model is updated train again)


// get the controllers
const userLoginController = require('./controllers/UserLoginController');
const OutfitListingController = require('./controllers/OutfitListingController');
const favouritesController = require('./controllers/favouritesController');
const registrationController = require('./controllers/registrationController');
const cartController =  require('./controllers/cartController');
const listingController = require('./controllers/listingController');
const homeFiltersController = require('./controllers/homeFilterController');
const accountController = require('./controllers/accountController');
const checkoutController = require('./controllers/checkoutController');
const outfitRatingController = require('./controllers/outfitRatingController');
const orderHistoryController = require('./controllers/orderHistoryController');


// Get the models
const { User } = require("./models/User");
const { category } = require("./models/category");
const {Cart} = require("./models/Cart");
const {Transaction} = require("./models/Transaction");

const about = require("./chatBot/aboutFitxchange");


const aboutCompany = about.aboutCompany;
const termsAndConditions = about.termsAndConditions;

//----------------------------------------------------------------------------

/*Set guest User*/
var activeUser= new User("guest","","","","","","","",false);

//delete this user after testing

//turn on to skip login
//var activeUser= new User("U001","","","","","","","",true);
// ---------------------------------------------------------------------------

//checking the cookie in the login
app.use(async (req, res, next) => {
    // If user is not in session, try to find 'rememberMe' cookie
    if (!req.session.activeUser && req.cookies.rememberMe) {
      const user = await User.findById(req.cookies.rememberMe);
      if (user) {
        user.setLoginStatus(true);
        req.session.activeUser = user;
      }
    }
    next();
  });

  function ensureLoggedIn(req, res, next) {
    if (req.session.activeUser && req.session.activeUser.login_Status) {
      next();
    } else {
      res.render("login", { title: "Login", referencePage: "account" });
    }
  }
  


  
// Create a route for root - /
app.get("/", async function(req, res)
 {
    
    activeUser =  req.session.activeUser || activeUser;
    
    // Get inventory items based on the page
    const inventoryItems = await homeFiltersController.filterItems(req, res);
    const categories = await category.getCategory_Names();
    //console.log(inventoryItems);
    //console.log(categories);
    // Render appropriate page based on whether the user is logged in
    //console.log(req.session.activeUser);
    //console.log(activeUser);
    if (activeUser.login_Status) {
        //console.log(".........\n",inventoryItems);
        res.render("home-logged-in", {
            title: 'Home',
            products: inventoryItems.results,
            nextPage: inventoryItems.nextPage,
            prevPage: inventoryItems.prevPage,
            loginStatus: activeUser.login_Status,
            categories:categories,
            userRole: activeUser.userRole,
        }); 
        
    } else {
        res.render("home", {
            title: 'Home',
            products: inventoryItems.results,
            nextPage: inventoryItems.nextPage,
            prevPage: inventoryItems.prevPage,
            loginStatus: activeUser.login_Status,
            categories
        });
    }
});
app.post("/", async (req, res) => {
    try {
      activeUser = req.session.activeUser || activeUser;
      const inventoryItems = await homeFiltersController.filterItems(req, res);
      const categories = await category.getCategory_Names();
      if (activeUser.login_Status) {
        return res.render("home-logged-in", {
          title: "Home",
          products: inventoryItems.results,
          nextPage: inventoryItems.nextPage,
          prevPage: inventoryItems.prevPage,
          loginStatus: activeUser.login_Status,
          categories: categories,
          userRole: activeUser.userRole
        });
      } else {
        return res.render("home", {
          title: "Home",
          products: inventoryItems.results,
          nextPage: inventoryItems.nextPage,
          prevPage: inventoryItems.prevPage,
          loginStatus: activeUser.login_Status,
          categories: categories
        });
      }
    } catch (error) {
      console.error("Error in POST / route:", error.message);
      res.status(500).send("Server error: " + error.message);
    }
  });
  
// create route for outfit listing
app.get("/outfit-listing/:id", (req, res) => {
       
    res.locals.activeUser = activeUser;    
    listingController.showOutfitListing(req, res);
});


app.get("/account", ensureLoggedIn, accountController.getAccountPage);
app.post('/account/update', ensureLoggedIn, accountController.updateAccount);

app.get("/inventory/remove/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Inventory.removeItemFromInventory(id);
    res.redirect(`/redirect/account/Removing Item From Inventory`);
  } catch (err) {
    console.error("Error removing inventory item:", err);
    res.status(500).send("Error removing inventory item.");
  }
});



// Create a route for add outfit lising - /
app.get("/new-listing", function(req, res){
    res.render("new-listing",{title:'New Listing'});
});

app.post("/new-listing", upload.single('image'), listingController.submitListing);

// Route to display the update listing page
app.get("/inventory/update/:id", listingController.showUpdateListingPage);

// Route to process the update form submission
app.post("/inventory/update/:id", upload.single('image'), listingController.updateListing);

// Create a route for cart lising
app.get("/cart", async function(req, res) {
    activeUser =  req.session.activeUser || activeUser;
    if (activeUser.login_Status) {
        try {
            // Fetch cart items for the logged-in user
            cartController.viewCart(req, res);
            
            
            
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).render("error", { message: 'An error occurred while fetching cart items.' });
        }
    } else {
        // If the user is not logged in, redirect to login page
        res.render("login", { title: 'Login', referencePage: 'cart' });
    }
});

// View cart page
//app.get('/cart', ensureLoggedIn, cartController.viewCart);

// Delete a single item from the cart
app.post('/cart/delete/:cartId', cartController.deleteCartItem);

app.get('/cart/add', cartController.addToCart);


// Create a route for outfit details -/
app.get('/Outfit/:orderId', async (req, res) => {
    const orderId = req.params.orderId; // Get the order ID from the URL parameter
    try {
        const product = await db.query('SELECT * FROM Inventory WHERE Inventory_ID = ?', [orderId]);
        if (product.length > 0) {
            if (typeof product[0].Images == 'string') {
                product[0].Images = product[0].Images.split(',');
            }
            res.render('Outfit', { title: 'Outfit Details', product: product[0] });
        } else {
            res.status(404).send('Product not found');
        }   
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a route for delete cart item -/
app.get('/remove/:cartId', async (req, res) => {
    const cartId = req.params.cartId; // Get the cart ID from the URL parameter
    try {
        await Cart.deleteCartItem(cartId); // Call the delete method from Cart model
        res.redirect('/cart'); // Redirect to the cart page after deletion
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a route for checkout lising - /
app.get("/checkout", async function(req, res) {

  activeUser =  req.session.activeUser || activeUser;
 

  if(activeUser.login_Status){
    
    console.log("User enrollment status is: ",activeUser.enrollment_status);
    if(activeUser.enrollment_status==='pending'){
      res.render("awaiting-enrollment",{title:'Enrollment Pending'});

    }
    else{
      const cartItems = await checkoutController.getCheckout(req,res); 

      console.log(cartItems);
      res.render("checkout",{title:'Checkout', cartItems, activeUser});
    }
  }
  else{
      res.render("login",{title:'Login', referencePage: 'checkout' });}
  
});


app.post("/checkout", checkoutController.processCheckout);



// Create a route for login
app.get("/login", async function(req, res){
    res.render("login",{title:'Login'});
});
app.post("/login", userLoginController.login);


// Create a route for log out
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        activeUser = new User("guest","","","","","","","",false);
        res.redirect('/');
        
    });
});

// Create a route for registration
app.get("/register", async function(req, res){
    res.render("register",{title:'Register', referencePage: 'login'});
});
app.post("/register", upload.single('image'), registrationController.registerUser);

// GET route for order history (using query parameters)
app.get("/order-history", async (req, res) => {
  const activeUser = req.session.activeUser || {};
  if (activeUser && activeUser.login_Status) {
    // The controller will use req.query for sorting/searching.
    await orderHistoryController.getOrderHistory(req, res);
  } else {
    res.render("login", { title: 'Login', referencePage: 'order-history' });
  }
});

// POST route for filtering/searching order history
app.post("/order-history", async (req, res) => {
  const activeUser = req.session.activeUser || {};
  if (!activeUser || !activeUser.login_Status) {
    return res.render("login", { title: 'Login', referencePage: 'order-history' });
  }
  // The controller will use req.body to determine sortOrder and searchQuery.
  await orderHistoryController.getOrderHistory(req, res);
});

// New POST route for order rating submission
app.post("/order-rating", outfitRatingController.submitRating);

// Create a route for add outfit advice - /
app.get("/outfit-advice", function(req, res){
    activeUser = req.session.activeUser || activeUser;
  
    if(activeUser.login_Status) {
      const history = req.session.chatHistory || [];
      const now = new Date();
      const lastSeen = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      res.render("chatBot/chatBot", {
        title: 'Fashion Advice',
        conversation: history,
        activeUser: activeUser,
        lastSeen: lastSeen
      });
    }
    else {
      res.render("login", {
        title:'Login',
        referencePage: 'outfit-advice'
      });
    }
  });
  
// POST route for the chat bot (outfit advice)
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message || '';

  // Ensure we have a chatHistory array in session
  if (!req.session.chatHistory) {
    req.session.chatHistory = [];
  }

  // Store user's message in session with a timestamp
  req.session.chatHistory.push({
    speaker: 'user',
    text: userMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  try {
    // Get GPT or NLP response
    const gptReply = await processUserMessage(userMessage, aboutCompany, termsAndConditions);

    // Attempt to parse GPT reply as JSON (for outfit search)
    let categories;
    let isOutfitSearch = false;
    try {
      categories = JSON.parse(gptReply);
      if (Array.isArray(categories)) {
        isOutfitSearch = true;
      }
    } catch (err) {
      // If parsing fails, we assume it is a normal text response.
    }

    let botReply;
    let outfitIDs = [];  // This will hold the unique outfit IDs

    if (isOutfitSearch) {
      // Outfit search: construct SQL queries based on the categories
      const sqlStatements = getSQLStatementsFromKeywords(categories);
      let inventoryMatches = [];

      for (const sql of sqlStatements) {
        const rows = await db.query(sql);
        inventoryMatches = inventoryMatches.concat(rows.map((r) => r.Inventory_ID));
      }

      // Remove potential duplicates
      outfitIDs = [...new Set(inventoryMatches)];

      // Create a friendly bot reply
      botReply = "Good news! I've found something special for you:";

      // Fetch detailed item info for each matching Inventory_ID
      let itemDetails = [];
      for (const id of outfitIDs) {
        const detailRows = await db.query(`
          SELECT 
            Inventory_ID, 
            Name,
            Description,
            Product_Image_Path,
            Price
          FROM Inventory
          WHERE Inventory_ID = '${id}'
        `);
        if (detailRows.length > 0) {
          itemDetails.push(detailRows[0]);  // Grab the first (and assuming only) row
        }
      }

      // Store the bot's response (including item details) into session
      req.session.chatHistory.push({
        speaker: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: itemDetails  // Attach detailed item info for the client to display
      });

      // Return the JSON response with the friendly text, outfit IDs, and item details
      return res.json({
        reply: botReply,
        outfitIDs: outfitIDs,
        items: itemDetails
      });
    } else {
      // Normal text response (non-outfit search)
      botReply = gptReply;
      req.session.chatHistory.push({
        speaker: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      return res.json({ reply: botReply });
    }
  } catch (err) {
    console.error('Error in /chat route:', err);
    return res.status(500).json({ error: err.message });
  }
});
  
  
app.get("/inspect-items", function(req, res){

    res.render("admin/inspect-items",{title:'Login'});

});

// Route to view saved items for the logged-in user
app.get("/favourites", async (req, res) => {
    if (req.session.activeUser && req.session.activeUser.login_Status) {
        try {
            // Call filterSavedItems, which likely renders the template
            await favouritesController.filterSavedItems(req, res);
        } catch (error) {
            console.error('Error fetching saved items:', error);
            res.status(500).render("error", { message: 'An error occurred while fetching your favorites.' });
        }
    } else {
        res.render("login", { title: 'Login', referencePage: 'favourites'  });
    }
});

// Route to handle filtering saved items (POST request)
app.post("/favourites", favouritesController.filterSavedItems);

// Route to handle adding items to favorites (POST request)
app.get("/favourites/add", async (req, res) => {
  const {inventoryId} = req.query; // Get inventoryId from request body
  const userId = req.session.activeUser.userID;
  console.log("getting ready to add: ", inventoryId, userId);

  try {
      await favouritesController.addToFavourites(userId, inventoryId);

      //res.send("added to favourites.");
    
  } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).json({ message: 'Error adding to favorites' }); // Send JSON error response
  }
});


app.get("/remove-outfit/:id", async (req, res) =>  {
    
    await favouritesController.removeFromFavourites(req, res); 
});

// Route to view terms and conditions
app.get("/terms-and-conditions", async (req, res) => {
    res.render("termsofuse");
});

app.get("/redirect/:redirectLocation/:msg", async (req, res) => {

    const msg = req.params.msg;
    // Get the redirect location and remove the leading slash
    const redirectLocation = req.params.redirectLocation.startsWith('/')
        ? req.params.redirectLocation.substring(1)
        : req.params.redirectLocation;
    console.log(redirectLocation);
    // Keep the full URL for redirection (with the leading slash)
    let redirectUrl = `/${req.params.redirectLocation}`;
    if(redirectLocation == "home-logged-in" ){
        redirectUrl = '/'
    }
    console.log(redirectUrl);
    // Pass both redirectUrl and redirectLocation to the Pug template
    res.render("redirect-page", { redirectUrl, redirectLocation,msg });
});

 

//admin controller and admin pages

const AdminController = require('./controllers/AdminController'); // Import the AdminController
const { Administrator } = require('./models/Administrator'); // Import the Administrator model
const { Inventory } = require("./models/Inventory");

app.get("/admin", AdminController.adminDashboard);

// Admin task routes
app.get("/admin/verify-new-users", AdminController.verifyNewUsers);

app.post("/admin/verify-new-users/remove/:id", AdminController.removeUser);

app.get("/admin/inspect-items", AdminController.inspectItems);

app.post("/admin/inspect-items/approve/:id", async (req, res) => {
    const inventoryId = req.params.id;
    try {
        await new Administrator().approveItem(inventoryId); // Approve item
        res.redirect("/admin/inspect-items");
    } catch (error) {
        console.error("Error approving item:", error);
        res.status(500).send("Error approving item.");
    }
});

app.post("/admin/inspect-items/reject/:id", async (req, res) => {
    const inventoryId = req.params.id;
    try {
        await new Administrator().rejectItem(inventoryId); // Reject item
        res.redirect("/admin/inspect-items");
    } catch (error) {
        console.error("Error rejecting item:", error);
        res.status(500).send("Error rejecting item.");
    }
});

app.get("/admin/monitor-listings", AdminController.monitorListings);

app.post("/admin/monitor-listings/remove/:id", AdminController.removeOutfit);

app.get("/admin/resolve-disputes", AdminController.resolveDisputes);

app.post("/admin/resolve-disputes/resolve/:id", AdminController.resolveDispute);


// Start server on port 3000

app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

