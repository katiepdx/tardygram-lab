const chance = require('chance').Chance();
const Gram = require('../models/gram');
const UserService = require('../services/user-service');

module.exports = async({ userCount = 5, gramCount = 100 } = {}) => {
  const users = await Promise.all([...Array(userCount)].map((_, i) => {
    return UserService.create({
      email: `login@user${i}.com`,
      password: `user${i}password`,
      profile_photo_url: `profile-photo-url.user${i}`
    });
  }));

  const grams = await Promise.all([...Array(gramCount)].map((_, i) => {
    return Gram.insert({
      photo_url: `photo_url.com${i}`,
      caption: 'my super cool photo',
      tags: ['cool', 'photo'],
      user_id: chance.pickone(users).id
    });
  }));
};
