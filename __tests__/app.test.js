const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const userService = require('../lib/services/user-service');

describe('tardygram-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('checks that a new user is signed up using POST', async() => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'create@user1.com',
        password: 'user1password',
        profile_photo_url: 'profile-photo-url.user1'
      });

    // do not send password or password hash back
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'create@user1.com',
      profile_photo_url: 'profile-photo-url.user1'
    });
  });

  // login test
  it('checks that a user can login using POST', async() => {
    // create a user with password hash using UserService create function
    const user = await userService.create({
      email: 'login@user1.com',
      password: 'user1password',
      profile_photo_url: 'profile-photo-url.user1'
    });
    
    // make login request to app with user info 
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'login@user1.com',
        password: 'user1password',
        profile_photo_url: 'profile-photo-url.user1'
      });

    // expected for successful login 
    expect(response.body).toEqual({
      id: user.id,
      email: 'login@user1.com',
      profile_photo_url: 'profile-photo-url.user1'
    });
  });
});
