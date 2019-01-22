const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const moment = require('moment');
const UserModel = require('../models/user');

// local strategy registration setup for username and password
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

// login local strategy for token retrieval
passport.use('login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, async (username, password, done) => {
  // check for username and password
  if (username && password) {
    try {
      // search for user in the database
      const user = await UserModel.findOne({ username });
      // check for user
      if (!user) {
        return done(null, false, { message: 'user not found' });
      }
      // validate password for desired user
      const validate = await user.isValid(password);
      if (!validate) {
        return done(null, false, { message: 'wrong password' });
      }
      return done(null, user, { message: 'Logged in Successfully!' });
    } catch (error) {
      return done(error);
    }
  }
  return done(null, false, { message: 'missing parameters: username, password' });
}));


// Json web token strategy extracted from header of request
passport.use(new JWTstrategy({
  secretOrKey: 'top_secret',
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}, async (token, done) => {
  try {
    // check to see if the date written comes before current server time
    if (moment().isAfter(token.user.expiresIn)) {
      return done(null, false, { message: 'token is expired' });
    }
    return done(null, token.user);
  } catch (error) {
    return done(error);
  }
}));
