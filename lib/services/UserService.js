const User = require('../models/User');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/user');

module.exports = class UserService {
  static async create(code) {
    const token = await exchangeCodeForToken(code);
    const { login, avatar_url, email, created_at, bio, public_repos } =
      await getGithubProfile(token);

    let user = await User.findByUsername(login);

    if (!user) {
      user = await User.createUser({
        github: login,
        avatar: avatar_url,
        repos: public_repos,
        bios: bio,
        memberSince: created_at,
        email,
      });
    }

    return user;
  }
};
