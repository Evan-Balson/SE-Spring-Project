const { User } = require("../models/User");

exports.registerUser = async (req, res) => {
    const { referencePage, firstName, lastName, email, address, phone, password, termsofuse } = req.body;
    const image = req.file; // This will contain info about the file if uploaded

    console.log(termsofuse);
    if (termsofuse) {
        const userData = { firstName, lastName, email, address, phone, password, image: image.path };

        try {
            // Call the model to register the user
            const result = await User.registerUser(userData);
            console.log("Here is the result from the insert function", result);

            // Check if referencePage is provided, if not, set a default page
            const redirectTo = referencePage || '/login';

            // Redirect to /redirect/:redirectpage where :redirectpage is the referencePage value
            return res.redirect(`/redirect/${encodeURIComponent(redirectTo)}/'Registration Successful'`);

        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).render('register', {
                title: 'Register',
                error: 'An error occurred during registration. Please try again.'
            });
        }
    } else { // terms and conditions not accepted
        res.render("register", { title: 'Register', error: 'Agree to Terms & Conditions to continue' });
    }
};

