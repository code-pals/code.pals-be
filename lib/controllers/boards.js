const { Router } = require('express');
const authentication = require('../middleware/authentication.js');
const Board = require('../models/Board');

module.exports = Router()
  .post('/', authentication, async (req, res) => {
    const board = await Board.insert({
      created_by: req.user.created_by,
      title: req.body.title,
      summary: req.body.summary,
      goal: req.body.goal,
      group_size: req.body.group_size,
    });
    res.json(board);
  })
  .get('/', async (req, res) => {
    const board = await Board.getAll();
    res.json(board);
  })
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const board = await Board.getById(id);
    res.json(board);
  })
  .patch('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const patch = await Board.getById(id);
    const board = await Board.update(id, {
      created_by: req.user.created_by,
      title: req.body.title,
      summary: req.body.summary,
      goal: req.body.goal,
      group_size: req.body.group_size,
      created: patch.created,
    });
    res.json(board);
  })
  .delete('/:id', authentication, async (req, res) => {
    const { id } = req.params;
    const board = await Board.delete(id);

    res.json(board);
  });
