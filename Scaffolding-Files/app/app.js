// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("./app/public"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res)
 {
    var user = { name: 'John Doe', loggedIn: true };

    const itemsPerPage = 4;
    let currentPage = parseInt(req.query.page) || 1; // Get the page number from the query or default to 1

    // Calculate the OFFSET
    const offset = (currentPage - 1) * itemsPerPage;


    // Assuming your table is named 'Inventory'
    var sql = `SELECT * FROM Inventory LIMIT ${itemsPerPage + 1} OFFSET ${offset}`;
    db.query(sql).then(results => {
        console.log(results);
       // res.json(results);

        // Data fetched successfully
        const nextPage = results.length === itemsPerPage + 1 ? currentPage + 1 : null;
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
    
        // Remove the extra item if it exists
        if (results.length === itemsPerPage + 1) {
            results.pop();
        }

        if (user.loggedIn) {
            res.render("home-logged-in", {
                title: 'Home',
                products: results,
                nextPage,
                prevPage
            });
        } else {
            res.render("home", {
                title: 'Home',
                products: results,
                nextPage,
                prevPage
            });
        }
    });
});


// Create a route for add outfit lising - /
app.get("/outfit-listing-guest", function(req, res){
    res.render("outfit-listing-logged-out",{title:'Listing'});
});

// Create a route for account - /
app.get("/account", function(req, res){
    res.render("account",{title:'My Account'});
});

// Create a route for add outfit lising - /
app.get("/new-listing", function(req, res){
    res.render("new-listing",{title:'New Listing'});
});

// Create a route for add outfit lising - /
app.get("/cart", function(req, res){
    res.render("cart",{title:'My Cart'});
});

// Create a route for add outfit lising - /
app.get("/checkout", function(req, res){
    res.render("checkout",{title:'Checkout'});
});

// Create a route for add outfit lising - /
app.get("/login", function(req, res){
    res.render("login",{title:'Login'});
});

// Create a route for add outfit lising - /
app.get("/register", function(req, res){
    res.render("register",{title:'Register'});
});


// Create a route for add outfit lising - /
app.get("/order-history", function(req, res){
    res.render("order-history",{title:'My Orders'});
});

// Create a route for add outfit lising - /
app.get("/outfit-advice", function(req, res){
    res.render("outfit-advice",{title:'Fashion Advice'});
});

// Create a route for add outfit lising - /
app.get("/favourites", function(req, res){
    res.render("favourites",{title:'Favourites'});
});




// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});