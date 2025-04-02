const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { login } = require('./auth/login');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/login', login);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
