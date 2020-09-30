// access files
const fs = require('fs');
// query db
const pool = require('../utils/pool');
// get seed file
const seed = require('./seed');

beforeEach(() => {
  return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
});

// use seed file
beforeEach(() => {
  return seed();
});
