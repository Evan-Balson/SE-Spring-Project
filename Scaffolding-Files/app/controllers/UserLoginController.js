const { User } = require("../models/User");
 
const login = async (req, res) => {
    try {
        const { email, password, remember, referencePage } = req.body;
        
        // Authenticate user with the provided email and password
        const user = await User.authenticate(email, password);
        
        if (user) {
            // Store user info in session
            user.setLoginStatus(true);
            req.session.activeUser = user;

            // If 'remember me' was checked, set a persistent cookie
            if (remember) {
                // Use the user ID for the cookie token
                res.cookie("rememberMe", user.userID, { 
                maxAge: 30 * 60 * 1000, // 30 minutews
                httpOnly: true,                 // helps protect against XSS
                sameSite: "strict"              // helps protect against CSRF
                });
            }
            

            // Check if referencePage is provided, if not, set a default page
            const redirectTo = referencePage || '/';

            if(redirectTo == '/'){
                
                return res.redirect(`/redirect/home-logged-in/Login Successful`);
            }
            else{

            // Redirect to /redirect/:redirectpage where :redirectpage is the referencePage value
            return res.redirect(`/redirect/${encodeURIComponent(redirectTo)}/Login Successful`);}

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

