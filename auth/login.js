const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

// Mock function to simulate fetching a user from the database
async function getUserByUsername(username) {
    // Replace this with actual database logic
    return { id: 1, username, hashedPassword: await bcrypt.hash('password123', 10) };
}

async function login(req, res) {
    const { username, password, rememberMe } = req.body;

    // Fetch user from database
    const user = await getUserByUsername(username);
    if (!user) {
        return res.status(401).send('Invalid username or password');
    }

    // Compare entered password with stored hashed password
    console.log('Stored Hashed Password:', user.hashedPassword); // Log the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    console.log('Password Match:', isPasswordValid); // Log whether the password matches

    if (!isPasswordValid) {
        return res.status(401).send('Invalid username or password');
    }

    // Generate session token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: rememberMe ? '30d' : '1h',
    });

    // Set cookie if "Remember Me" is checked
    if (rememberMe) {
        res.setHeader('Set-Cookie', cookie.serialize('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            sameSite: 'strict',
        }));
    }

    res.status(200).send({ message: 'Login successful', token });
}

module.exports = { login };
