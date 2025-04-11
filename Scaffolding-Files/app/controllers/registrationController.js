const { User } = require("../models/User");

// Register a new user
const registerUser = async (req, res) => {
    const {
        referencePage,
        firstName,
        lastName,
        email,
        address,
        phone,
        password,
        termsofuse
    } = req.body;

    const image = req.file;

    console.log(termsofuse);

    if (termsofuse) {
        const userData = {
            firstName,
            lastName,
            email,
            address,
            phone,
            password,
            image: image?.path || null
        };

        try {
            // Attempt to register the user
            const result = await User.registerUser(userData);
            console.log("Here is the result from the insert function", result);

            // Redirect to the reference page (default: /login)
            const redirectTo = referencePage || '/login';
            return res.redirect(`/redirect/${encodeURIComponent(redirectTo)}/'Registration Successful'`);
        } catch (error) {
            console.error('Error during registration:', error);
            return res.status(500).render('register', {
                title: 'Register',
                error: 'An error occurred during registration. Please try again.'
            });
        }
    } else {
        // Terms of use not accepted
        return res.render("register", {
            title: 'Register',
            error: 'Agree to Terms & Conditions to continue'
        });
    }
};

module.exports = {
    registerUser
};
