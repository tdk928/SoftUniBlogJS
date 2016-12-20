const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    content: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    date: {type: Date, default: Date.now()},
    article: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Article'}
});

const Comment = mongoose.model('Comment', commentSchema);
module.export = Comment;