const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/products', require('./controllers/products'));
app.use('/checkout', require('./controllers/checkout'));

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
