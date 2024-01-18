const mongoose = require("mongoose")

//mongoose.connect("URL")

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, required: true },
    comments: { type: Array, default: [] },
    timestamp: { type: Date },
    published: { type: Boolean }
});

const CommentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    comment: { type: String, required: true },
    postId: { type: String, required: true }, // change type to object id later
    timestamp: { type: Date }
})


const Post = mongoose.model('Post', PostSchema)
const Comment = mongoose.model('Comment', CommentSchema)


module.exports = {
    Post,
    Comment
}