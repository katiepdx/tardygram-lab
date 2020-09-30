// express router
const { Router } = require('express');
const ensureAuth = require('../middleware/ensureAuth');
const Gram = require('../models/gram');

module.exports = Router()
  .post('/', ensureAuth, (req, res, next) => {
    Gram
      // add gram post for user who created the post
      .insert({ ...req.body, user_id: req.user.id })
      .then(gram => res.send(gram))
      .catch(next);
  });
