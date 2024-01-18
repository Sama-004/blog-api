const express = require('express');
const router = express.Router();
const { Post, Comment } = require('./db');

//get all post
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({ published: true }).select("-_id")
        const populatedPosts = await Post.populate(posts, { path: 'comments', select: 'username comment -_id' });

        res.json({
            // posts
            populatedPosts
        })
    } catch (err) {
        res.status(401).json({
            msg: "Get post error"
        })
    }
})

//get a speicific post
router.get('/post/:postid', async (req, res) => {
    const id = req.params.postid
    try {
        const postbyId = await Post.findById(id);
        if (!postbyId) {
            res.status(404).json({
                msg: "No post found with the id"
            })
        }
        res.json(postbyId)
    } catch (err) {
        res.status(501).json("error finding post with id")
    }
})
//post blog
router.post('/post', async (req, res) => {
    const { title, content, author } = req.body
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content, and authorId are required fields.' });
    }
    try {
        const newPost = await Post.create({
            title,
            content,
            author,
            timestamp: new Date()
        })
        if (!newPost) {
            res.json({
                msg: "Failed to create blog"
            })
        } res.json({
            msg: "Blog created successfully"
        })
    } catch (err) {
        res.json({
            msg: "Error in creating blog"
        })
    }
})

//post comment
router.post("/comment/:postid", async (req, res) => {
    const postId = req.params.postid
    const { username, comment } = req.body
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const newComment = await Comment.create({
            username,
            comment,
            postId: post._id,
            timestamp: new Date()
        });
        post.comments.push(newComment._id);
        await post.save();
        res.json({
            msg: "Comment posted successfully"
        })
    } catch (err) {
        res.json({
            msg: "error positng comment"
        })
    }
})
//get all comments of a blog
router.get("/post/:postid/comments", async (req, res) => {
    const postId = req.params.postid
    try {
        const comments = await Comment.find({ postId }).select("username comment timestamp -_id")
        res.json(comments)
    } catch (err) {
        res.status(411).json({
            msg: "Can't find comments from the post"
        })
    }
})
//get a specific comment
router.get("/posts/:postId/comment/:commentId", async (req, res) => {
    const postId = req.params.postId
    const commentId = req.params.commentId
    try {
        const comment = await Comment.findOne({ _id: commentId, postId });

        if (!comment) {
            return res.status(501).json({ error: "Comment not found" })
        }
        res.json(comment)
    } catch (err) {
        res.status(401).json({
            msg: "error getting the specified comment"
        })
    }
})
//edit comment
router.put("/comment/edit/:id", async (req, res) => {
    const commentId = req.params.id
    const { comment } = req.body
    const timestamp = new Date()
    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId },
            { comment, timestamp },
            { new: true }
        )
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json({
            msg: "Updated comment",
            timestamp: timestamp
        })
    } catch (err) {
        res.json({
            msg: "Error editing a commment"
        })
    }
})
//edit blog
router.put("/post/edit/:id", async (req, res) => {
    const postId = req.params.id
    const { title, content } = req.body
    const timestamp = new Date()
    try {
        const updatePost = await Post.findOneAndUpdate(
            { _id: postId },
            { title, content, timestamp },
            { new: true }
        )
        if (!updatePost) {
            return res.status(404).json({ error: "Failed to edit blog" })
        }
        res.json({
            msg: "Updated blog"
        })
    } catch (err) {
        res.json({
            msg: "Errror editing blog"
        })
    }
})
//delete a specific comment
router.delete("/comment/delete/:id", async (req, res) => {
    const commentId = req.params.id
    try {
        const deleteComment = await Comment.findOneAndDelete({ _id: commentId })
        if (!deleteComment) {
            return res.status(404).json({ error: "Failed to delete blog with the given id" })
        }
        const updatedPost = await Post.findOneAndUpdate(
            { _id: deleteComment.postId },
            { $pull: { comments: commentId } },
            { new: true }
        );
        res.json({
            msg: "Comment deleted successfully"
        })
    } catch (err) {
        res.json({
            msg: "error deleting comment"
        })
    }
})
//delete a specific blog
router.delete("/post/delete/:id", async (req, res) => {
    const postId = req.params.id
    try {
        const deletePost = await Post.findOneAndDelete({ _id: postId })
        if (!deletePost) {
            return res.status(404).json({ error: "failed to delete post with the given id" })
        }
        await Comment.deleteMany({ postId: postId })
        res.json({
            msg: "Post deleted successfully"
        })
    } catch (err) {
        res.json({
            msg: "error deleting post"
        })
    }
})
//list unpublished blogs 
router.get("/posts/unpublished", async (req, res) => {
    try {
        const unpublishedBlogs = await Post.find({ published: false }).select("-_id")
        res.status(200).json({
            unpublishedBlogs
        })
    } catch (err) {
        res.json({
            msg: "error getting the list of unpublished blogs"
        })
    }
})

module.exports = router