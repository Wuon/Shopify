const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const winston = require('../services/winston');

const router = express.Router();

// This route is only used for testing to create accounts faster.
// A different implementation would be used in production.
router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.status(200).json({
    isSuccess: true,
  });
});

/**
 * @api {post} /login authenticate
 * @apiExample {js} Example usage with axios:
 *     axios.post(`${BASE_URI}/login`, {
 *       username: 'username',
 *       password: 'password',
 *     });
 * @apiParamExample {json} Request-Example:
 *  {
 *    username: 'username',
 *    password: 'password',
 *  }
 * @apiName /login
 * @apiGroup authentication
 *
 * @apiParam {String} username username
 * @apiParam {String} password password
 *
 * @apiSuccess {Boolean} isSuccess response
 * @apiSuccess {String} token token
 * @apiSuccessExample Success-Response:
 *    {
 *      isSuccess: true,
 *      token: 'jwt',
 *    }
 *
 * @apiError {Boolean} isSuccess response
 * @apiError {String} error message
 * @apiErrorExample Success-Response:
 *    {
 *      isSuccess: false,
 *      error: 'invalid credentials',
 *    }
 *
 */
router.post('/login', async (req, res, next) => {
  const winstonObject = {
    id: winston.getSessionId(),
  };
  winston.info('begin POST /login', {}, winstonObject);
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        winston.info('401 POST /login', {}, winstonObject);
        return res.status(401).json({
          isSuccess: false,
          error: info.message,
        });
      }
      return req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const token = jwt.sign({ user: { _id: user._id, username: user.username, expiresIn: moment().add(1, 'day') } }, 'top_secret');
        winston.info('200 POST /login', {}, winstonObject);
        return res.status(200).json({
          isSuccess: true,
          token,
        });
      });
    } catch (error) {
      winston.error('500 POST / login', { error: error.toString(), stack: error.stack }, winstonObject);
      res.status(500).json(error);
    }
  })(req, res, next);
});

module.exports = router;
