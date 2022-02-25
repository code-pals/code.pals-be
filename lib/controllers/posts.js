const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Post = require('../models/Post');
const User = require('../models/User.js');

module.exports = Router()
  .post('/', authentication, async (req, res) => {
    
    
    const post = await Post.insert({
      postedBy: req.user.userId,
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
    });
    const user = await User.getById(req.user.userId);
    console.log('userinpost', user);


    res.json([post, user]);
  })
  .get('/', async (req, res) => {
    const post = await Post.getAll();
    res.json(post);
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.getById(id);

    res.json(post);
  })
  .patch('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const patch = await Post.getById(id);

    const post = await Post.update(id, {
      postedBy: req.user.userId,
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
      created: patch.created,
    });
    res.json(post);
  })
  .delete('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const post = await Post.delete(id);

    res.json(post);
  });
