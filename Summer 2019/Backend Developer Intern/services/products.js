const mongodb = require('mongodb');

const loadProductsCollection = () => mongodb.MongoClient.connect(
  process.env.MONGODB_URI,
  {
    useNewUrlParser: true,
  },
).then(client => client.db(process.env.MONGODB_USER).collection('products'));

module.exports.find = () => loadProductsCollection()
  .then(products => products.find({}).toArray().then(query => query));

module.exports.findOne = _id => loadProductsCollection()
  .then(products => products.find({ _id }).toArray().then(query => query[0]));

module.exports.findInStock = () => loadProductsCollection()
  .then(products => products.find({ inventory_count: { $gt: 0 } }).toArray().then(query => query));

module.exports.validateCart = (cart) => {
  const promises = [];
  for (let i = 0; i < cart.length; i += 1) {
    promises.push(
      module.exports.findOne(cart[i].id).then(item => ((item) ? {
        id: cart[i].id,
        isAllowed: item.inventory_count - cart[i].quantity >= 0,
      } : {
        id: cart[i].id,
        isAllowed: false,
      })),
    );
  }
  return Promise.all(promises);
};

module.exports.purchase = (cart) => {
  const promises = [];
  for (let i = 0; i < cart.length; i += 1) {
    promises.push(
      loadProductsCollection()
        .then(products => products.findOneAndUpdate({ _id: cart[i].id },
          { $inc: { inventory_count: -cart[i].quantity } })),
    );
  }
  return Promise.all(promises);
};
