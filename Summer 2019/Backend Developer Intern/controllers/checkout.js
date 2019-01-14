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
router.post('/', (req, res) => {
  if (req.body.cart) {
    const set = new Set();
    if (!req.body.cart.some(obj => set.size === set.add(obj.id).size)) {
      products.validateCart(req.body.cart)
        .then((response) => {
          if (Object.keys(response)
            .filter(i => !response[i].isAllowed)
            .map(Number).length === 0) {
            winston.info('200 POST /checkout', response, req.winstonObject);
            res.status(200).json({
              isSuccess: true,
              cart: response,
            });
          } else {
            winston.info('422 POST /checkout', {
              cart: response,
              error: 'some item(s) either do not exist, or do not have the required inventory to process the request',
            }, req.winstonObject);
            res.status(422).json({
              isSuccess: false,
              cart: response,
              error: 'some item(s) either do not exist, or do not have the required inventory to process the request',
            });
          }
        })
        .catch((error) => {
          winston.error('500 POST /checkout', { error: error.toString(), stack: error.stack }, req.winstonObject);
          res.status(500).json({
            isSuccess: false,
            error: error.toString(),
          });
        });
    } else {
      winston.info('422 POST /checkout', { error: 'duplicate items in cart' }, req.winstonObject);
      res.status(422).json({
        isSuccess: false,
        error: 'duplicate items in cart',
      });
    }
  } else {
    winston.info('422 POST /checkout', { error: 'cart parameter missing' }, req.winstonObject);
    res.status(422).json({
      isSuccess: false,
      error: 'missing parameters: cart',
    });
  }
});

module.exports = router;
