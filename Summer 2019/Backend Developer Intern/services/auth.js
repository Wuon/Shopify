const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const moment = require('moment');
const UserModel = require('../models/user');

passport.use('signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    const user = await UserModel.create({ username, password });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    const validate = await user.isValid(password);
    if (!validate) {
      return done(null, false, { message: 'Wrong Password' });
    }
    return done(null, user, { message: 'Logged in Successfully!' });
  } catch (error) {
    return done(error);
  }
}));

passport.use(new JWTstrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
  try {
    if (moment().isAfter(token.user.expiresIn)) {
      return done(new Error('token expired'));
    }
    return done(null, token.user);
  } catch (error) {
    return done(error);
  }
}));
