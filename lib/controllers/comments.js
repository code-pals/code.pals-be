/* eslint-disable no-console */
const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', authentication, async (req, res, next) => {
    try {
      const comment = await Comment.createComment(req.body);
      console.log('comment', comment);
      res.json(comment);
    } catch (err) {
      next(err);
    }
  })
  .get('/:postId', async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const comments = await Comment.getCommentsByPost(postId);
      res.json(comments);
    } catch (err) {
      next(err);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const keyword = req.query.keyword;
      const results = await Comment.searchComments(keyword);
      console.log('searchresults', results);
      res.json(results);
    } catch (err) {
      next(err);
    }
  })
  .get('/comment/:commentId', async (req, res, next) => {
    try{
      console.log('hit route');
      const commentId = req.params.commentId;
      console.log(commentId, req.params);
      const comment = await Comment.getCommentById(commentId);
      res.json(comment);
    } catch(err) {
      next(err);
    }
  })
  .get('/parent/:postId', async (req, res, next) => {
    try{
      const postId = req.params.postId;
      const comments = await Comment.aggregateByParent(postId);
      console.log(comments);
      res.json(comments);
    }catch(err){
      next(err);
    }
  });

