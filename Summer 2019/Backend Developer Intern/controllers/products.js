const express = require('express');
const products = require('../services/products');
const winston = require('../services/winston');

const router = express.Router();

/**
 * @api {get} /products Fetch all products, or all products in stock
 * @apiExample {js} Example usage with axios:
 *     axios.get(`${BASE_URI}/products`);
 *     axios.get(`${BASE_URI}/products`, {
 *       params: {
 *         inStock: 'true',
 *       },
 *     });
 * @apiName /products
 * @apiGroup products
 *
 * @apiParam {String} inStock if true, returns all products in stock
 *
 * @apiSuccessExample Success-Response:
 *    [
 *
 *    ]
 *
 */
router.get('/', (req, res) => {
  const promise = (req.query.inStock === 'true') ? products.findInStock() : products.find();
  Promise.resolve(promise)
    .then((response) => {
      winston.info('200 GET /products', response, req.winstonObject);
      res.status(200).json(response);
    })
    .catch((err) => {
      winston.error('500 POST /products', { error: err.toString(), stack: err.stack }, req.winstonObject);
      res.status(500).json(err);
    });
});

/**
 * @api {get} /products/:id Fetch a specific product
 * @apiExample {js} Example usage with axios:
 *     axios.get(`${BASE_URI}/products/1`);
 * @apiName /products/:id
 * @apiGroup products
 *
 * @apiParam {String} id the product's unique identifier
 *
 * @apiSuccessExample Success-Response:
 *    [
 *
 *    ]
 *
 */
router.get('/:id', (req, res) => {
  products.findOne(req.params.id)
    .then((response) => {
      if (response) {
        winston.info(`200 GET /products/${req.params.id}`, response, req.winstonObject);
        res.status(200).json(response);
      } else {
        winston.info(`422 GET /products/${req.params.id}`, response, req.winstonObject);
        res.status(422).json(response);
      }
    })
    .catch((err) => {
      winston.error('500 POST /products', { error: err.toString(), stack: err.stack }, req.winstonObject);
      res.status(500).json(err);
    });
});

module.exports = router;
