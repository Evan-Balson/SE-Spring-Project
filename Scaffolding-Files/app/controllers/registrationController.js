const { User } = require("../models/User");

    // Controller function to handle user registration
exports.registerUser = async (req, res) => {
    const { firstName, lastName, phone, dob, password } = req.body;

    const userData = { firstName, lastName, phone, dob, password };

    try {
        // Call the model to register the user
        const result = await User.registerUser(userData);
        console.log("here is the result from the insert function", result);

        // If the user was successfully inserted
        res.status(201).redirect('/login');  // Redirect to login page or wherever you'd like
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).render('register', {
            title: 'Register',
            error: 'An error occurred during registration. Please try again.'
        });
    }
};


