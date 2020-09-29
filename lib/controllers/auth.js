// express router
const { Router } = require('express');
// ensureAuth for attaching cookie 
const ensureAuth = require('../middleware/ensureAuth');
// UserService for app logic 
const UserService = require('../services/user-service');

// constant for cookie expiration - 1 hour 
const ONE_HOUR = 1000 * 60 * 60;

// user attach cookie for the routes
const attachCookie = (user, res) => {
  // make a token for the user
  const token = UserService.makeToken(user);
  res.cookie('session', token, {
    // expiration
    maxAge: ONE_HOUR,
    httpOnly: true,
    sameSite: 'none'
  });
};

// routers using Router()
module.exports = Router() 
  .post('/signup', (req, res, next) => {
    UserService
      // create a password hash using user provided info
      .create(req.body)
      // attach a cookie to that user
      .then(user => {
        attachCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      // check the info user types matches db
      .authorization(req.body)
      // if there is a match 
      .then(user => {
        // attach cookie to user
        attachCookie(user, res);
        res.send(user);
      })
      .catch(next);
  })

  // verify user with ensureAuth middleware
  .get('/verify', ensureAuth, (req, res) => {
    // send user
    res.send(req.user);
  });
