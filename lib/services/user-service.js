// bcrypt for password hashing 
const bcrypt = require('bcryptjs');
// jwt for wristband auth
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 14;

// create a password hash - takes in users email and password 
const create = async({ email, password, profile_photo_url }) => {
  // hash password with bcrypt - password_hash like in user model 
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  console.log(password_hash);

  // return password_hash
  return User.insert({ email, password_hash, profile_photo_url });
};

// make a token for the user
const makeToken = user => {
  const token = jwt.sign(user.toJSON(), process.env.APP_SECRET, {
    expiresIn: '1h'
  });
  return token;
};

module.exports = {
  create,
  makeToken
};
