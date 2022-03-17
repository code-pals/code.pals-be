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
    res.json(post);
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
    const post = await Post.update(id, {
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
    });
    res.json(post);
  })
  .delete('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const post = await Post.delete(id);
    res.json(post);
  })
  .get('/username/:username', async (req, res) => {
    const { username } = req.params;
    const posts = await Post.getAllByUsername(username);
    res.json(posts);
  })
  .patch('/favorite/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const post = await Post.favoriteComment(commentId, req.body.postId);
    res.json(post);
  });
