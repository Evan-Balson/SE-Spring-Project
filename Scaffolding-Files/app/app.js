// ------------------- MODULES -------------------
const express = require("express");
const multer = require("multer");
const path = require("path");
const session = require("express-session");

// ------------------- INIT APP -------------------
const app = express();

app.use(session({
  secret: 'z1x2c3v4b5n6m7a8s9d',
  resave: false,
  saveUninitialized: true
}));

// ------------------- FILE UPLOAD SETUP -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, './public/images')),
  filename: (req, file, cb) =>
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });
const bodyParser= require('body-parser');

// ------------------- MIDDLEWARE -------------------
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ------------------- IMPORT CONTROLLERS & MODELS -------------------
const db = require("./services/db");
const userLoginController = require("./controllers/UserLoginController");
const OutfitListingController = require("./controllers/OutfitListingController");
const favouritesController = require("./controllers/favouritesController");
const registrationController = require("./controllers/registrationController");
const AdminController = require("./controllers/AdminController");
const cartController = require("./controllers/cartController");
const { listingController } = require("./controllers/listingController");
const homeFiltersController = require("./controllers/homeFilterController");
const deliveryController = require("./controllers/deliveryController");
const transactionController = require("./controllers/transactionController");
const checkoutController = require("./controllers/checkoutController");
const PaymentController = require("./controllers/PaymentController");

const { User } = require("./models/User");
const { Inventory } = require("./models/Inventory");
const { Cart } = require("./models/Cart");
const { Transaction } = require("./models/transaction");

// ------------------- DEFAULT GUEST USER -------------------
let defaultUser = new User("guest", "", "", "", "", "", "", "", false);

// ------------------- ROUTES -------------------

// Home route
app.get("/", async (req, res) => {
  req.session.activeUser ||= defaultUser;
  const activeUser = req.session.activeUser;
  const inventoryItems = await homeFiltersController.filterItems(req, res);

  const pageToRender = activeUser.login_Status ? "home-logged-in" : "home";
  res.render(pageToRender, {
    title: 'Home',
    products: inventoryItems.results,
    nextPage: inventoryItems.nextPage,
    prevPage: inventoryItems.prevPage,
    loginStatus: activeUser.login_Status
  });
});

app.post("/", homeFiltersController.filterItems);

app.post('/search', async (req, res) => {
    const searchTerm = req.body.searchTerm; // Retrieve the search term from the form

    try {
        // Call the search function to query the database
        const results = await searchInventory(searchTerm);

        if (results.length > 0) {
            // If results are found, render them
            return res.render('search-results', { title: 'Search Results', products: results });
        } else {
            // If no results are found, render a "no results" message
            return res.render('search-results', { title: 'Search Results', products: [], message: 'No products found' });
        }
    } catch (error) {
        console.error('Error during search:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Listing & cart
app.get("/outfit-listing/:id", OutfitListingController.showOutfitListing);
app.get("/new-listing", (req, res) => res.render("new-listing", { title: 'New Listing' }));
app.post("/new-listing", upload.single('image'), listingController.submitListing);

// Cart
app.get("/cart", cartController.viewCart);
app.delete("/cart/:cartId", cartController.deleteCartItem);
app.get("/cart/add", async (req, res) => {
    if (!req.session.activeUser) {
      return res.redirect("/login");  // Redirect to login page if user is not logged in
    }
  
    try {
      await Cart.addToCart(req.session.activeUser.userID, req.query.inventoryId);
      res.redirect('/cart');
    } catch (error) {
      res.status(500).send("Error adding to cart");
    }
  });
app.get("/remove/:cartId", async (req, res) => {
  try {
    await Cart.deleteCartItem(req.params.cartId);
    res.redirect("/cart");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Favourites
app.get("/favourites", favouritesController.filterSavedItems);
app.post('/favourites/add', async (req, res) => {
    if (!req.session.activeUser) {
      return res.redirect("/login");
    }
  
    const { inventoryId } = req.body; // Assuming you send inventoryId as part of the request body
    try {
      await favouritesController.addToFavourites(req.session.activeUser.userID, inventoryId);
      res.send('Item added to favourites');
    } catch (error) {
      res.status(500).send('Error adding to favourites');
    }
  });

// Outfit Details
app.get("/Outfit/:orderId", async (req, res) => {
  try {
    const product = await db.query("SELECT * FROM Inventory WHERE Inventory_ID = ?", [req.params.orderId]);
    if (product.length > 0) {
      if (typeof product[0].Images === 'string') {
        product[0].Images = product[0].Images.split(',');
      }
      res.render("Outfit", { title: "Outfit Details", product: product[0] });
    } else {
      res.status(404).send("Product not found");
    }
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// Checkout & Payment
app.get("/process-checkout", checkoutController.processCheckout);


app.get("/delivery/:transactionId", (req, res) => {
  const cartItems = req.session.cartItems || [];
  const totalAmount = req.session.totalAmount;
  const deliveryCost = req.session.deliveryCost || 5.58;
  const subtotal = req.session.subtotal;

  const deliveryAddress = req.session.deliveryAddress;
  const deliveryOption = req.session.deliveryOption;
  const deliveryDate = req.session.deliveryDate;

  res.render("delivery", {
      transactionId: req.params.transactionId,
      cartItems: cartItems,
      totalAmount: totalAmount,
      deliveryCost: deliveryCost,
      subtotal: subtotal,
      deliveryAddress: deliveryAddress,
      deliveryOption: deliveryOption,
      deliveryDate: deliveryDate,
  });
});
app.post("/delivery/:transactionId", (req, res) => {

  const cartItems = req.session.cartItems || [];
  let subtotal = 0;
  if (cartItems) {
    subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  }
  const deliveryCost = 5.58; 
  const totalAmount = subtotal + deliveryCost;

  req.session.deliveryCost = deliveryCost;
  req.session.subtotal = subtotal;
  req.session.totalAmount = totalAmount;

  res.redirect(`/payment/${req.params.transactionId}`);
});

app.get("/payment/:transactionId", (req, res) => {
  const transactionId = req.params.transactionId;
  const subtotal = req.session.subtotal || 0; 
  const deliveryCost = req.session.deliveryCost || 5.58; 
  const finalTotal = parseFloat(subtotal) + parseFloat(deliveryCost); // Calculate the final total

  console.log('Payment Page - Transaction ID:', transactionId);
  console.log('Payment Page - Subtotal:', subtotal);
  console.log('Payment Page - Delivery Cost:', deliveryCost);
  console.log('Payment Page - Final Total:', finalTotal);
  console.log('Payment Page - Total Amount being passed:', finalTotal.toFixed(2));

  res.render("payment", {
    transactionId: transactionId,
    totalAmount: finalTotal, 
    subtotal: subtotal, 
    deliveryCost: deliveryCost 
  });
});
app.post('/process-payment', PaymentController.processPayment);
app.post('/payment-confirmation', PaymentController.processPayment);

// Route for free orders
app.get('/confirmation/free', (req, res) => {
  res.render('confirmation', {
    title: 'Order Confirmed',
    transaction: { 
      Transaction_ID: 'FREE_ORDER_' + Date.now(),
      Payment_Type: 'Free Order',
      Total_Amount: 0,
      Transaction_Date: new Date(),
    },
  });
});

// Route for successful payments (with payment ID)
app.get('/confirmation/:paymentId', async (req, res) => {
  const { paymentId } = req.params;

  try {

    const transaction = await transaction.getTransactionByPaymentId(paymentId);

    if (transaction) {
      res.render('confirmation', {
        title: 'Order Confirmed',
        transaction: transaction,
      });
    } else {
      // Handle case where transaction is not found
      res.render('confirmation', {
        title: 'Confirmation Error',
        transaction: null,
      });
    }
  } catch (error) {
    console.error('Error fetching transaction for confirmation:', error);
    res.render('confirmation', {
      title: 'Confirmation Error',
      transaction: null,
    });
  }
});


// Auth routes
app.get("/login", (req, res) => res.render("login", { title: "Login" }));
app.post("/login", userLoginController.login);
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    req.session = null;
    res.redirect("/");
  });
});
app.get("/register", (req, res) => res.render("register", { title: "Register" }));
app.post("/register", upload.single("image"), registrationController.registerUser);

// Order history (mocked)
app.get("/order-history", (req, res) => {
  if (!req.session.activeUser?.login_Status) return res.render("login", { title: "Login" });

  const orders = [
    {
      itemName: "Casual Tee",
      image: "/images/dress.jpeg",
      description: "Comfortable and stylish",
      orderDate: "2023-09-01",
      dispatchTo: "User Address",
      penalty: 5.00
    },
    {
      itemName: "Summer Dress",
      image: "/images/dress.jpeg",
      description: "Perfect for summer outings",
      orderDate: "2023-09-02",
      dispatchTo: "User Address",
      penalty: 10.00
    }
  ];
  res.render("order-history", { title: "My Orders", orders });
});

// Advice
app.get("/outfit-advice", (req, res) => {
  if (req.session.activeUser?.login_Status) {
    res.render("outfit-advice", { title: "Fashion Advice" });
  } else {
    res.render("login", { title: "Login" });
  }
});


app.get("/remove-outfit/:id", favouritesController.removeFromFavourites);

// Terms
app.get("/terms-and-conditions", (req, res) => res.render("termsofuse"));

// Redirection handler
app.get("/redirect/:redirectLocation", (req, res) => {
  const redirectLocation = req.params.redirectLocation.replace(/^\/+/, "");
  res.render("redirect-page", {
    redirectUrl: `/${redirectLocation}`,
    redirectLocation
  });
});

// Optional admin routes
/*
app.get("/admin", AdminController.adminDashboard);
app.get("/admin/verify-new-users", AdminController.verifyNewUsers);
app.get("/admin/inspect-items", AdminController.inspectItems);
app.get("/admin/monitor-listings", AdminController.monitorListings);
app.get("/admin/resolve-disputes", AdminController.resolveDisputes);
*/

// ------------------- START SERVER -------------------
app.listen(3000, () => {
  console.log("Server running at http://127.0.0.1:3000/");
});