/* eslint-disable no-console */
const { Router } = require('express');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      console.log(req.body);
      const comment = await Comment.createComment(req.body);
      res.json(comment);
    } catch (err) {
      next(err);
    }
  })
  .get('/:postId', async (req, res, next) => {
    try{
      const postId = req.params.postId;
      const comments = await Comment.getCommentsByPost(postId);
      res.json(comments);
    } catch (err){
      next(err);
    }
  });

