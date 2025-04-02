const bcrypt = require('bcrypt');

// Mock function to simulate saving a user to the database
async function saveUser(user) {
    // Replace this with actual database logic
    console.log('User saved:', user);
}

async function register(req, res) {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user with hashed password
    await saveUser({ username, hashedPassword });

    res.status(201).send({ message: 'User registered successfully' });
}

module.exports = { register };
