// access files
const fs = require('fs');
// query db
const pool = require('../utils/pool');
// get seed file
const seed = require('./seed');
const request = require('supertest');
const app = require('../app');

beforeEach(() => {
  return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
});

// use seed file
beforeEach(() => {
  return seed();
});

// add a logged in user 
const agent = request.agent(app);
beforeEach(() => {
  // login
  return agent
    .post('/api/v1/auth/signup')
    .send({
      email: 'verifyUser@user1.com',
      password: 'user1password',
      profile_photo_url: 'profile-photo-url.user1'
    });
});

module.exports = {
  getAgent: () => agent 
};
