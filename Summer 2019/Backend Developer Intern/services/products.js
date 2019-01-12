const mongodb = require('mongodb');

const loadProductsCollection = () => mongodb.MongoClient.connect(
  'mongodb://127.0.0.1:27017',
  {
    useNewUrlParser: true,
  },
).then(client => client.db('test').collection('products'));

module.exports.find = () => loadProductsCollection()
  .then(products => products.find({}).toArray().then(query => query));

module.exports.findOne = _id => loadProductsCollection()
  .then(products => products.find({ _id }).toArray().then(query => query[0]));

module.exports.findInStock = () => loadProductsCollection()
  .then(products => products.find({ inventory_count: { $gt: 0 } }).toArray().then(query => query));
