const UserService = require('../services/user-service');

module.exports = (req, res, next) => {
  try {
    // read session cookie
    const token = req.cookies.session;
    // verify token and set that to be the payload for the user
    const payload = UserService.verifyToken(token);
    // attach user to req.user
    req.user = {
      id: payload.id,
      email: payload.email,
      profile_photo_url: payload.profile_photo_url
    };
    // move to next
    next();
    // error
  } catch(error) {
    next(error);
  }
};
