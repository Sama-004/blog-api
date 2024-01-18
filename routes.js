const express = require('express');
const router = express.Router();
const { Post, Comment } = require('./db');

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({})
        res.json({
            posts
        })
    } catch (err) {
        res.status(401).json({
            msg: "Get post error"
        })
    }
})

module.exports = router