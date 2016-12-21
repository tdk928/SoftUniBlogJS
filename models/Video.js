const mongoose = require('mongoose');

let videoSchema = mongoose.Schema({
    title: {type: String, required: true},
    videoPath: {type: String},
    author: {type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User'},
});

const Video = mongoose.model('Video', videoSchema);
module.export = Video;