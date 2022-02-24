const fetch = require('cross-fetch');

const exchangeCodeForToken = async (code) => {
  const tokenEx = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  });
  const { access_token } = await tokenEx.json();
  return access_token;
};

const getGithubProfile = async (access_token) => {
  const profileReq = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `token ${access_token}`,
    },
  });
  const profile = await profileReq.json();
  console.log('PROFILE', profile);
  return profile;
};
module.exports = { exchangeCodeForToken, getGithubProfile };
