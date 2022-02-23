const { Router } = require('express');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const comment = await Comment.insert(req.body);
      res.json(comment);
    } catch (err) {
      next(err);
    }
  });

