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
app.get("/outfit-listing", function(req, res){
    const productDetails = {
        name: 'Green Exotic Sundress',
        sku: 'SKU123456',
        price: 25.66,
        originalPrice: 40.34,
        description: 'A designer dress from Tampa, Florida. Perfect for summer outings and beach holidays.',
        sizeOptions: ['XL', 'L'],
        color: 'Dark Green',
        material: '100% Organic Cotton',
        careInstructions: 'Hand wash or professional dry clean only',
        imagePath: '/images/dress.jpeg'
    };
    res.render("outfit-listing",{title:'Listing', product: productDetails});
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
    const cartItems = [
        {
            orderId: '2311140-8793735',
            name: 'Green exotic sundress',
            image: '/images/dress.jpeg',
            description: 'Designer dress from Tampa Florida',
            orderDate: '16 January 2025',
            penalty: '7.99',
            dispatchTo: 'Evan Balson',
            deliveryDate: '17 January 2025'
        },
        {
            orderId: '2311140-8793736',
            name: 'Green exotic sundress',
            image: '/images/dress.jpeg',
            description: 'Designer dress from Tampa Florida',
            orderDate: '16 January 2025',
            penalty: '7.99',
            dispatchTo: 'Evan Balson',
            deliveryDate: '17 January 2025'
        },
        ];
    res.render("cart",{title:'My Cart', cartItems});
});

// Create a route for add outfit lising - /
app.get("/checkout", function(req, res){
    const cartItems = [
        {
            name: 'Casual Tee',
            image: '/images/dress.jpeg',
            description: 'A comfortable casual wear',
            quantity: 1,
            penalty: 10.00,
            orderDate: '2023-09-01',
            deliveryDate: '2023-09-05',
            dispatchTo: 'User Address'
        },
        {
            name: 'Summer Dress',
            image: '/images/dress.jpeg',
            description: 'Perfect for summer outings',
            quantity: 1,
            penalty: 15.00,
            orderDate: '2023-09-02',
            deliveryDate: '2023-09-06',
            dispatchTo: 'User Address'
        }
      ];
      
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  

    res.render("checkout",{title:'Checkout', cartItems, total});
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
    res.render("order-history",{title:'My Orders', orders});
});

// Create a route for add outfit lising - /
app.get("/outfit-advice", function(req, res){
    res.render("outfit-advice",{title:'Fashion Advice'});
});

// Create a route for add outfit lising - /
app.get("/favourites", function(req, res){
    const outfits = [
        { id: 1, name: 'Casual Tee', image: "/images/dress.jpeg", savedDate: '01 October 2025' },
        { id: 2, name: 'Summer Dress', image: '/images/dress.jpeg', savedDate: '12 September 2025' },
        { id: 3, name: 'Evening Wear', image: '/images/dress.jpeg', savedDate: '18 August 2025' },
        { id: 4, name: 'Spring Jacket', image: '/images/dress.jpeg', savedDate: '24 July 2025' },
        { id: 5, name: 'Winter Coat', image: './images/dress.jpeg', savedDate: '15 June 2025' },
        { id: 6, name: 'Formal Attire', image: '/images/dress.jpeg', savedDate: '30 May 2025' }
      ];
    res.render("favourites",{title:'Favourites', outfits});
});

  




// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});