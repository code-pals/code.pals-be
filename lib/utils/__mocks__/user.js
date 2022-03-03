/* eslint-disable no-console */
const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken${code}`);

  return 'hiiii';
};

const getGithubProfile = async (access_token) => {
  console.log(`MOCK INVOKED GITHUBPROFILE: getGithubProfile${access_token}`);
  return {
    login: 'ProsperieEli',
    id: 80539871,
    avatar_url: 'https://avatars.githubusercontent.com/u/80539871?v=4',
    bio: 'A software Engineer who has proficient work in teams and conveying thoughts to a broad audience. ',
  };
};
module.exports = { exchangeCodeForToken, getGithubProfile };
