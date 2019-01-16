const mongodb = require('mongodb');
const winston = require('./winston');

const loadProductsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('products'));

module.exports.find = (winstonObject) => {
  winston.info('begin products.find', {}, winstonObject);
  return loadProductsCollection()
    .then(products => products.find({}).toArray().then((query) => {
      winston.info('end products.find', { query }, winstonObject);
      return query;
    }));
};

module.exports.findOne = (_id, winstonObject) => {
  winston.info('begin products.findOne', { _id }, winstonObject);
  return loadProductsCollection()
    .then(products => products.find({ _id }).toArray().then((query) => {
      winston.info('end products.findOne', { query }, winstonObject);
      return query[0];
    }));
};

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

module.exports.validateCart = (req, winstonObject) => {
  winston.info('begin validateCart', { req }, winstonObject);
  let total = 0;
  const promises = [];
  for (let i = 0; i < req.cart.length; i += 1) {
    promises.push(
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
    const response = Object.keys(results).filter(i => !results[i])
      .map(Number).length === 0 && req.total === Math.round(total * 100) / 100;
    winston.info('end validateCart', { response }, winstonObject);
    return response;
  });
};

module.exports.purchase = (cart, winstonObject) => {
  winston.info('begin purchase', { cart }, winstonObject);
  const promises = [];
  for (let i = 0; i < cart.length; i += 1) {
    promises.push(
      loadProductsCollection()
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
    const response = Object.keys(results).filter(i => !results[i])
      .map(Number).length === 0;
    winston.info('end purchase', { response }, winstonObject);
    return response;
  });
};
