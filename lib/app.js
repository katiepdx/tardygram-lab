const express = require('express');
const app = express();

app.use(express.json());

// middleware that creates the req.cookies
app.use(require('cookie-parser')());
// Routes
app.use('/api/v1/auth', require('./controllers/auth'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
