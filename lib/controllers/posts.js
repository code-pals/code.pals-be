const { Router } = require('express');
const Post = require('../models/Post');

module.exports = Router()
  .post('/', async (req, res) => {
    const post = await Post.insert({
      posted_by: req.body.posted_by,
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
  .patch('/:id', async (req, res) => {
    const { id } = req.params;
    const patch = await Post.getById(id);

    const post = await Post.update(id, {
      posted_by: req.body.posted_by,
      title: req.body.title,
      code: req.body.code,
      question: req.body.question,
      created: patch.created,
    });
    res.json(post);
  })
  .delete('/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.delete(id);

    res.json(post);
  });
