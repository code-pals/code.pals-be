const {Router} = require('express')
const Post = require('../models/Post')

module.exports = Router().post('/', async(req, res) => {
    const post = await Post.insert({
        posted_by: req.posted_by,
        title: req.title,
        code: req.code,
        question: req.question,
        created: req.created
    })
    res.json(post)
})
.getAll('/', async(req, res) => {
    const post = await Post.getAll()
    res.json(post)
})
.getById('/:id', async(req, res) => {
    const {post_id} = req.params;
    const post = await Post.getById(post_id)

    res.json(post)
})
.update('/:id', async(req, res) => {
    const {post_id} = req.params;
    await Post.getById(post_id)
    const post = await Post.update(post_id,{
        posted_by: req.body.posted_by,
        title: req.body.title,
        code: req.body.code,
        question: req.body.question,
        created: req.body.created
    })
    res.json(post)
})
.delete('/:id', async(req, res) => {
    const {post_id} = req.params;
    const post = await Post.delete(post_id)

    res.json(post)
})