const { User } = require("../models/User");
 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Authenticate user with the provided email and password
        const user = await User.authenticate(email, password);
        
        if (user) {
            // Store user info in session
            user.setLoginStatus(true);
            req.session.activeUser = user;
            

            // Redirect to home page (root)
            return res.redirect("/");
        } else {
            // Invalid login
            res.render("login", { title: 'Login', error: 'Invalid email or password' });
        }
    } catch (error) {
        // Log and send error message
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
};



module.exports = {login}

