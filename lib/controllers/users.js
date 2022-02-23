const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication');
const UserService = require('../services/UserService');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user`
    );
  })

  .get('/login/callback', async (req, res) => {
    const user = await UserService.create(req.query.code);
    const userJWT = jwt.sign({ ...user }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res
      .cookie('session', userJWT, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      // .redirect('http://localhost:7891/tweets');
      .redirect('http://localhost:7891/oauthreturn');
  })

  .get('/me', authentication, async (req, res) => {
    res.json(req.user);
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
