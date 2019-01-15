const express = require('express');
const products = require('../services/products');
const winston = require('../services/winston');

const router = express.Router();

/**
 * @api {post} /checkout Purchase item(s)
 * @apiExample {js} Example usage with axios:
 *     axios.post(`${BASE_URI}/checkout`, {
 *       cart: [ {
 *         id: "1",
 *         quantity: "1",
 *       }, {
 *         id: "2",
 *         quantity: "2",
 *       }, {
 *         id: "3",
 *         quantity: "3",
 *       }]
 *     });
 * @apiParamExample {json} Request-Example:
 *       cart: [ {
 *         id: "1",
 *         quantity: "1",
 *       }, {
 *         id: "2",
 *         quantity: "2",
 *       }, {
 *         id: "3",
 *         quantity: "3",
 *       }]
 *     }
 * @apiName /checkout
 * @apiGroup products
 *
 * @apiParam {Object[]} cart array of items to purchase
 * @apiParam {String} id product's unique identifier
 * @apiParam {String} quantity amount
 *
 * @apiSuccess {Boolean} isSuccess response
 * @apiSuccessExample Success-Response:
 *    {
 *      isSuccess: true,
 *    }
 *
 * @apiError {Boolean} isSuccess response
 * @apiError {String} error message
 * @apiErrorExample Success-Response:
 *    {
 *      isSuccess: false,
 *      error: 'some item(s) either do not exist, or do not have the required inventory to process the request',
 *    }
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
            products.purchase(req.body.cart).then(() => {
              winston.info('200 POST /checkout', {}, req.winstonObject);
              res.status(200).json({
                isSuccess: true,
              });
            }).catch((error) => {
              winston.error('500 POST /checkout', { error: error.toString(), stack: error.stack }, req.winstonObject);
              res.status(500).json({
                isSuccess: false,
                error: error.toString(),
              });
            });
          } else {
            winston.info('422 POST /checkout', {
              error: 'some item(s) either do not exist, or do not have the required inventory to process the request',
            }, req.winstonObject);
            res.status(422).json({
              isSuccess: false,
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
