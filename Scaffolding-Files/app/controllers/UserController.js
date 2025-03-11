const User = require('../models/User');

exports.login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const user = await User.authenticate (email, password);
        if (user) {
            res.render ('dashboard', {user : user});
        } else {
            res.render('login', {error: 'Invalid email or password'});
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status (500).send(error.toString());
    }
};
exports.register = async (req, res) => {
    try {
        const {name, email, password, address, contactNumber} = req.body;
        const newUser = new User (null, name, email, password, null, address)
        const result = await newUser.createAccount(email, password, name, address, contactNumber);
        if (result) {
            res.render('login', {success: "Registration Successful"})
        } else {
            res.render('register', {error: "Registration Failed"})
        }
    } catch (error) {
        console.error("Registration error: ", error);
        res.status(500).send(error.toString());
    }
};
exports.sell =async (req, res) => {
    try {
        const {name, email, password, address, role, outfitName, outfitColor, outfitSize, outfitDescription, itemCondition, categoryIds} = req.body;
        const user = await User.authenticate(email, password);
        if (!user){
            res.render('login', {error: "Please login first"});
            return;
        }
        const result = await user.sell(outfitName, outfitColor, outfitSize, outfitDescription, itemCondition, categoryIds);
        if(result) {
            res.render('dashboard', {user: user, success: "Outfit added successfully"})
        } else {
            res.render('sell', {user: user, error: "Failed to add outfit"});
        }
    } catch (error) {
        console.error("Sell error: ", error);
        res.status(500).send(error.toString());
    }
};

exports.review = async (req, res) => {
    try {
        const {email, password, outfitId, rating, comment} = req.body;
        const user = await User.authenticate(email, password);
        if (!user) {
            res.render('login', {error: "Please login first"});
            return;
        }
        const resutl = await user.writeReview(outfitId, rating, comment);
        if(result) {
            res.render('dashboard', {user: user, success: "Review added successfully"})
        } else {
            res.render('review', {user: user, error: "Failed to add review"});
        }
    } catch (error) {
        console.error("Review error: ", error);
        res.status(500).send(error.toString());
    }
};
exports.buy = async (req, res) => {
    try {
        const { email, password, outfitId} = req.body;
        const user = await User.authenticate(email, password);

        if (!user) {
            res.render('login', {error: "Please login first"});
            return;
        }
        const result = await user.buy(outfitId);
        if (result){
            res.render('dashboard', {user: user, success: "Outfit found"})
        } else {
            res.render('dashboard', {user: user, error: "Outfit not found"});
        }
    } catch (error) {
        console.error("Buy error: ", error);
        res.status(500).send(error.toString());
    }
};