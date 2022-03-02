const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Post = require('../models/Post');
const User = require('../models/User.js');

module.exports = Router()
  .post('/', authentication, async (req, res) => {
    console.log('createpost route');
    
    const post = await Post.insert({
      postedBy: req.user.userId,
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
    });
    
    res.json(post);
  })
  .get('/', async (req, res) => {
    const post = await Post.getAll();
    res.json(post);
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.getById(id);
    console.log('postidroute', post);

    res.json(post);
  })
  .patch('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const post = await Post.update(id, {
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
    });
    console.log('paaaatchpost', post);
    res.json(post);
  })
  .delete('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const post = await Post.delete(id);

    res.json(post);
  });
