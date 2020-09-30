const UserService = require('../services/user-service');

// data db with users 
module.exports = async({ userCount = 5 } = {}) => {
  // create an array of length userCount(5) and map through it
  await Promise.all([...Array(userCount)].map((_, i) => {
    // create a unique user email and password for each index in array
    return UserService.create({
      email: `login@user${i}.com`,
      password: `user${i}password`,
      profile_photo_url: `profile-photo-url.user${i}`
    });
  }));
};
