// bcrypt for password hashing 
const bcrypt = require('bcryptjs');
// jwt for wristband auth
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 2;

// create a password hash - takes in users email and password 
const create = async({ email, password, profile_photo_url }) => {
  // hash password with bcrypt - password_hash like in user model 
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

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

// check that what the user typed in matches the db records
const authorization = async({ email, password, profile_photo_url }) => {
  // look up user in db using provided email 
  const user = await User.findEmail(email);

  // ERROR CASE: if user email doesn't exist throw error msg
  if(!user) throw new Error('Invalid email or password. Please try again.');

  // MATCH: then match password user provided pw with db password_hash (from findEmail user)
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  // ERROR CASE: throw an err msg if password doesn't match
  if(!passwordMatch) throw new Error('Invalid email or password. Please try again');

  // on SUCCESSFUL authorization, return user
  return user;
};

// verify token - takes in a token 
const verifyToken = (token) => {
  // verify jwt token - need token and app secret
  const user = jwt.verify(token, process.env.APP_SECRET);
  // SUCCESS return user
  return user;
};

module.exports = {
  create,
  makeToken,
  authorization,
  verifyToken
};
