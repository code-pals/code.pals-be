/* eslint-disable no-console */
const User = require('../models/User');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/user');

module.exports = class UserService {
  static async create(code) {
    const token = await exchangeCodeForToken(code);
    console.log('TOKEN', token);
    const { login, avatar_url, email, created_at, bio, public_repos } =
      await getGithubProfile(token);
    console.log('LOGIN', login);
    let user = await User.findByUsername(login);
    console.log('USER', user);

    if (!user) {
      user = await User.createUser({
        github: login,
        avatar: avatar_url,
        email,
        repos: public_repos,
        bio,
        memberSince: created_at,
       
      });
    }

    return user;
  }
};
