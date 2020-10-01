require('../lib/data/data-helpers');
const request = require('supertest');
const app = require('../lib/app');
// import getAgent for logged in user
const { getAgent } = require('../lib/data/data-helpers');
const Gram = require('../lib/models/gram');

describe('grams routes', () => {
  it('creates a gram post using POST', async() => {
    // get a logged in user 
    const response = await getAgent()
      .post('/api/v1/grams')
      // make a gram post
      .send({
        photo_url: 'photo_url.com',
        caption: 'my super cool photo',
        tags: ['cool', 'photo']
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      photo_url: 'photo_url.com',
      caption: 'my super cool photo',
      tags: ['cool', 'photo'],
      user_id: expect.any(String)
    });
  });

  it('gets all gram posts', async() => {
    await Gram.findAll();

    const response = await request(app)
      .get('/api/v1/grams');

    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        photo_url: 'photo_url.com0',
        caption: 'my super cool photo',
        tags: ['cool', 'photo'],
        user_id: expect.any(String)
      }
    ]));
  });

  it('gets one gram post by id w/user that posted it', async() => {
    // get first gram
    await Gram.findGramById(1);

    const response = await request(app)
      .get('/api/v1/grams/1');

    expect(response.body).toEqual({
      id: '1',
      photo_url: 'photo_url.com0',
      caption: 'my super cool photo',
      tags: ['cool', 'photo'],
      user_id: expect.any(String)
    });
  });
});
