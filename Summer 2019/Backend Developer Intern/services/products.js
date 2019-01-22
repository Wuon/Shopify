const mongodb = require('mongodb');
const winston = require('./winston');

// load product collection. should have been replaced with mongoose
const loadProductsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('products'));

// generic findAll in products document
module.exports.find = (winstonObject) => {
  winston.info('begin products.find', {}, winstonObject);
  return loadProductsCollection()
    .then(products => products.find({}).toArray().then((query) => {
      winston.info('end products.find', { query }, winstonObject);
      return query;
    }));
};

// generic findOne in products document
module.exports.findOne = (_id, winstonObject) => {
  winston.info('begin products.findOne', { _id }, winstonObject);
  return loadProductsCollection()
    .then(products => products.find({ _id }).toArray().then((query) => {
      winston.info('end products.findOne', { query }, winstonObject);
      return query[0];
    }));
};

// find all products whose inventory stock is above 0. should have been to scale
// forward. for example all products above 0, 1, 2, etc
module.exports.findInStock = (winstonObject) => {
  winston.info('begin products.findInStock', {}, winstonObject);
  return loadProductsCollection()
    .then(products => products.find({ inventory_count: { $gt: 0 } }).toArray().then((query) => {
      winston.info('end products.findInStock', { query }, winstonObject);
      return query;
    }))
    .catch((err) => {
      winston.error('error products.findInStock', { error: err.toString(), stack: err.stack }, winstonObject);
    });
};

// validates if the current cart can be processed
module.exports.validateCart = (req, winstonObject) => {
  winston.info('begin validateCart', { req }, winstonObject);
  let total = 0;
  const promises = [];
  for (let i = 0; i < req.cart.length; i += 1) {
    promises.push(
      // search every item to see if the asked quantity can be performed
      // also checks total sum
      module.exports.findOne(req.cart[i].id, winstonObject)
        .then((item) => {
          if (item) {
            total += item.price * req.cart[i].quantity;
            return !(req.cart[i].quantity <= 0 || item.inventory_count - req.cart[i].quantity < 0
              || !req.cart[i].quantity);
          }
          return false;
        }).catch((err) => {
          winston.error('error validateCart', { error: err.toString(), stack: err.stack }, winstonObject);
          return false;
        }),
    );
  }
  return Promise.all(promises).then((results) => {
    // checks if all items are valid and if the given total matches the server side total
    const response = Object.keys(results).filter(i => !results[i])
      .map(Number).length === 0 && req.total === Math.round(total * 100) / 100;
    winston.info('end validateCart', { response }, winstonObject);
    return response;
  });
};

// execute purchase in the cart
module.exports.purchase = (cart, winstonObject) => {
  winston.info('begin purchase', { cart }, winstonObject);
  const promises = [];
  for (let i = 0; i < cart.length; i += 1) {
    promises.push(
      loadProductsCollection()
        // reduce the quantity of the stock by the given amount
        .then(products => products.findOneAndUpdate({ _id: cart[i].id },
          { $inc: { inventory_count: -cart[i].quantity } })
          .then(() => true)
          .catch((err) => {
            winston.error('error purchase', { error: err.toString(), stack: err.stack }, winstonObject);
            return false;
          }))
        .catch((err) => {
          winston.error('error purchase', { error: err.toString(), stack: err.stack }, winstonObject);
          return false;
        }),
    );
  }
  return Promise.all(promises).then((results) => {
    // check for any errors in the request
    const response = Object.keys(results).filter(i => !results[i])
      .map(Number).length === 0;
    winston.info('end purchase', { response }, winstonObject);
    return response;
  });
};
