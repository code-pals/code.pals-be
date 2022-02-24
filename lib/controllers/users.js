/* eslint-disable no-console */
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const authentication = require('../middleware/authentication');
const UserService = require('../services/UserService');
const User = require('../models/User.js');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user`
    );
  })

  .get('/login/callback', async (req, res) => {
    const user = await UserService.create(req.query.code);
    console.log('USER2', user);
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
    console.log('SSSSSTTTTTRRRRIIIIINNNNGGGG', req.user);
    res.json(req.user);
  })

  .patch('/profile/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id, 'userid');
    const user = await User.createProfile(
      {
        username: req.body.username,
        pronoun: req.body.pronoun,
        experience: req.body.experience,
        tech: req.body.tech,
      },
      id
    );
    console.log(user);
    res.json(user);
  })

  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
