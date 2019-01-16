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
 * @apiSuccess {Boolean} isSuccess response
 * @apiSuccess {Object[]} products information on the requested products
 * @apiSuccessExample Success-Response:
 *    {
 *      isSuccess: true,
 *      products: [{
 *        _id: '1',
 *        title: 'a',
 *        price: 1.99,
 *        inventory_count: 100
 *      },
 *      {
 *        _id: '2',
 *        title: 'b',
 *        price: 2.99,
 *        inventory_count: 99
 *      }]
 *    }
 *
 * @apiError {Boolean} isSuccess response
 * @apiError {String} error message
 * @apiErrorExample Success-Response:
 *    {
 *      isSuccess: false,
 *      error: 'an unexpected error has occurred',
 *    }
 *
 */
router.get('/', (req, res) => {
  const winstonObject = {
    id: winston.getSessionId(),
  };
  winston.info('begin GET /products', {}, winstonObject);
  const promise = (req.query.inStock === 'true') ? products.findInStock(winstonObject) : products.find(winstonObject);
  Promise.resolve(promise)
    .then((response) => {
      winston.info('200 GET /products', { products: response }, winstonObject);
      res.status(200).json({
        isSuccess: true,
        products: response,
      });
    })
    .catch((error) => {
      winston.error('500 GET /products', { error: error.toString(), stack: error.stack }, winstonObject);
      res.status(500).json({
        isSuccess: false,
        error,
      });
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
 * @apiSuccess {Boolean} isSuccess response
 * @apiSuccess {Object} product information on the requested product
 * @apiSuccessExample Success-Response:
 *    {
 *      isSuccess: true,
 *      product: {
 *        _id: '1',
 *        title: 'a',
 *        price: 1.99,
 *        inventory_count: 100
 *      }
 *    }
 *
 * @apiError {Boolean} isSuccess response
 * @apiError {String} error message
 * @apiErrorExample Success-Response:
 *    {
 *      isSuccess: false,
 *      error: 'an unexpected error has occurred',
 *    }
 *
 */
router.get('/:id', (req, res) => {
  const winstonObject = {
    id: winston.getSessionId(),
  };
  winston.info(`begin GET /products/${req.params.id}`, {}, winstonObject);
  products.findOne(req.params.id, winstonObject)
    .then((product) => {
      if (product) {
        winston.info(`200 GET /products/${req.params.id}`, { product }, winstonObject);
        res.status(200).json({
          isSuccess: true,
          product,
        });
      } else {
        winston.info(`422 GET /products/${req.params.id}`, { error: 'product not found' }, winstonObject);
        res.status(422).json({
          isSuccess: false,
          error: 'product not found',
        });
      }
    })
    .catch((error) => {
      winston.error(`500 GET /products/${req.params.id}`, { error: error.toString(), stack: error.stack }, winstonObject);
      res.status(500).json({
        isSuccess: false,
        error,
      });
    });
});

module.exports = router;
