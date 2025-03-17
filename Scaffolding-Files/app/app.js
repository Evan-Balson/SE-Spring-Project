// Import express.js
const express = require("express");

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
