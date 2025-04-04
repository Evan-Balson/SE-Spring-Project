// Import express.js
const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();

// import express-session so that we can track user login status site-wide
const session = require("express-session");

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
        cb(null, './app/public/uploads/');  // Directory where files should be stored
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


// Static files location
app.use(express.static("./app/public"));


/* included the parser so that it can read the page json forms
For URL-encoded data, we will use express.urlencoded() middleware:
Usage - landing page */ 
app.use(express.urlencoded({ extended: true }));


// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');


// Get the functions in the db.js file to use
const db = require('./services/db');

// get the controllers
const userLoginController = require('./controllers/UserLoginController');
const OutfitListingController = require('./controllers/OutfitListingController');
const favouritesController = require('./controllers/favouritesController');
const registrationController = require('./controllers/registrationController');
const AdminController = require('./controllers/AdminController');
const cartController =  require('./controllers/cartController');
const homeFiltersController = require('./controllers/homeFilterController');

// Get the models
const { User } = require("./models/User");
const { Inventory } = require("./models/Inventory");
const {Cart} = require("./models/Cart");
//----------------------------------------------------------------------------

/*Set guest User*/
var activeUser= new User("guest","","","","","","","",false);

//delete this user after testing

//turn on to skip login
//var activeUser= new User("U001","","","","","","","",true);
// ---------------------------------------------------------------------------

// Create a route for root - /
app.get("/", async function(req, res)
 {
    activeUser =  req.session.activeUser || activeUser;
    //console.log(activeUser)
    const currentPage = parseInt(req.query.page) || 1; // Get the page number from the query or default to 1
    const itemsPerPage = 4; // Number of items per page

    // Get inventory items based on the page
    const inventoryItems = await homeFiltersController.filterItems();
    console.log(inventoryItems);
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
            loginStatus: activeUser.login_Status
           
        }); 
        
    } else {
        res.render("home", {
            title: 'Home',
            products: inventoryItems.results,
            nextPage: inventoryItems.nextPage,
            prevPage: inventoryItems.prevPage,
            loginStatus: activeUser.login_Status
        });
    }
});
app.post("/", homeFiltersController.filterItems);

// create route for outfit listing
app.get("/outfit-listing/:id", (req, res) => {
    
   
    res.locals.activeUser = activeUser;

    
    OutfitListingController.showOutfitListing(req, res);
});

// Create a route for account - /
app.get("/account", function(req, res){
    res.render("account",{title:'My Account'});
});

// Create a route for add outfit lising - /
app.get("/new-listing", function(req, res){
    res.render("new-listing",{title:'New Listing'});
});

// Create a route for cart lising
app.get("/cart", async function(req, res) {
    if (activeUser.login_Status) {
        try {
            // Fetch cart items for the logged-in user
            const cartItems = await Cart.getCartItems(activeUser.userID);

            //console.log(cartItems);
            
            res.render("cart", { title: 'My Cart', cartItems });
            
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).render("error", { message: 'An error occurred while fetching cart items.' });
        }
    } else {
        // If the user is not logged in, redirect to login page
        res.render("login", { title: 'Login' });
    }
});

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
   
    const cartItems = await Cart.getCartItems(activeUser.userID); 

    console.log(cartItems);
  
    if(activeUser.login_Status){
        res.render("checkout",{title:'Checkout', cartItems});
    }
    else{
        res.render("login",{title:'Login'});}
    
});

//app.post("/checkout", cartController.processCheckout);



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
    res.render("register",{title:'Register'});
});
app.post("/register", upload.single('image'), registrationController.registerUser);


// Create a route for add order history - /
app.get("/order-history", function(req, res){
    const orders = [
    {
        itemName: 'Casual Tee',
        image: '/images/dress.jpeg',
        description: 'Comfortable and stylish',
        orderDate: '2023-09-01',
        dispatchTo: 'User Address',
        penalty: 5.00
    },
    {
        itemName: 'Summer Dress',
        image: '/images/dress.jpeg',
        description: 'Perfect for summer outings',
        orderDate: '2023-09-02',
        dispatchTo: 'User Address',
        penalty: 10.00
    }
];

    if(activeUser.login_Status){
        res.render("order-history",{title:'My Orders', orders});
    }
    else{
        res.render("login",{title:'Login'});}
    
    
});

// Create a route for add outfit advice - /
app.get("/outfit-advice", function(req, res){

    if(activeUser.login_Status){
        res.render("outfit-advice",{title:'Fashion Advice'});
    }
    else{
        res.render("login",{title:'Login'});}

});

app.get("/inspect-items", function(req, res){

    res.render("admin/inspect-items",{title:'Login'});

});



// Route to view saved items for the logged-in user
app.get("/favourites", async (req, res) => {
    //console.log(activeUser);
    if (activeUser.login_Status) {
        try {
            // Get saved items from the database using the controller method
            const savedItems = await favouritesController.filterSavedItems(req, res);
            //console.log(savedItems);
            
        } catch (error) {
            console.error('Error fetching saved items:', error);
            //res.status(500).render("error", { message: 'An error occurred while fetching your favorites.' });
        }
    } else {
        res.render("login", { title: 'Login' });  // If user is not logged in, render login page
    }
});
app.post("/favourites",favouritesController.filterSavedItems);


app.get("/remove-outfit/:id", async (req, res) =>  {
    
    await favouritesController.removeFromFavourites(req, res); 
});

app.get("/terms-and-conditions", async (req, res) => {
    res.render("termsofuse");
});

/*
//admin controller and admin pages
app.get("/admin", AdminController.adminDashboard);


//admin task routes
app.get("/admin/verify-new-users", AdminController.verifyNewUsers);
app.get("/admin/inspect-items", AdminController.inspectItems);
app.get("/admin/monitor-listings", AdminController.monitorListings);
app.get("/admin/resolve-disputes", AdminController.resolveDisputes);
*/

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});