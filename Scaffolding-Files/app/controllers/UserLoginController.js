// controllers/userController.js
const User = require('../models/User');

exports.login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.authenticate(email, password);
if (user) {
res.render('home-logged-in', { user: user });
} else {
res.render('login', { error: 'Invalid email or password' });
}
} catch (error) {
res.status(500).send(error.toString());
}
};