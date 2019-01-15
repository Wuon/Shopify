const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on('error', error => console.log(error));

require('./services/auth');

const app = express();

// Middleware
app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use('/', require('./controllers/auth'));
app.use('/products', require('./controllers/products'));
app.use('/checkout', passport.authenticate('jwt', { session: false }), require('./controllers/checkout'));

// documentation
app.use('/documentation', express.static(path.join(__dirname, 'doc')));

// Health check
app.get('/ping', (req, res) => {
  res.set('text/plain').status(200).send('pong');
});

// Fallback 404 response
app.get('*', (req, res) => {
  res.status(404).json({ isSuccess: false, error: 'The specified URI is unknown for the REST service.' });
});

const port = process.env.PORT || 3002;

app.listen(port, () => console.log(`Server started on port ${port}`));
