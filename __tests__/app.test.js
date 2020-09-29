const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/user-service');

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
    const user = await UserService.create({
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

  // verify user - check wristband 
  it('verifies a user using GET', async() => {
    const agent = request.agent(app);
    await agent
    // sign up a user using POST
      .post('/api/v1/auth/signup')
      .send({
        email: 'verifyUser@user1.com',
        password: 'user1password',
        profile_photo_url: 'profile-photo-url.user1'
      });
    
    // SUCCESSFUL check
    const response = await agent
      .get('/api/v1/auth/verify');
    // expect match 
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'verifyUser@user1.com',
      profile_photo_url: 'profile-photo-url.user1'
    });

    // FAILED check
    const responseWithoutUser = await request(app)
      .get('/api/v1/auth/verify');

    expect(responseWithoutUser.body).toEqual({
      status: 500,
      message: 'jwt must be provided'
    });

  });
});
