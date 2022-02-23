const {Router} = require('express')
const Board = require('../models/Board')

module.exports = Router().post('/', async(req, res) => {
    const board = await Board.Insert({
        created_by: req.created_by,
        title: req.title,
        summary: req.summary,
        goal: req.goal,
        group_size: req.group_size,
        created: req.created
    })
    res.json(board)
})
.get('/', async(req, res) => {
    const board = await Board.getAll()
    res.json(board)
})
.getById('/:id', async(req, res) => {
    const {board_id} = req.params;
    const board = await Board.getById(board_id)
    res.json(board);
})
.update('/:id', async(req, res) => {
    const {board_id} = req.params;
    await Board.getById(board_id)
    const board = await Board.update(board_id, {
        created_by: req.body.created_by,
        title: req.body.title,
        summary: req.body.summary,
        goal: req.body.goal,
        group_size: req.body.group_size,
        created: req.body.created
    })
    res.json(board)
})
.delete('/:id', async(req, res) => {
    const {board_id} = req.params;
    const board = await Board.delete(board_id)

    res.json(board)
})