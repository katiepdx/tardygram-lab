require('../lib/data/data-helpers');
// import getAgent for logged in user
const { getAgent } = require('../lib/data/data-helpers');

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
});
