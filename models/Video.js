const mongoose = require('mongoose');

let videoSchema = mongoose.Schema({
    title: {type: String, required: true},
    videoPath: {type: String}
});

const Video = mongoose.model('Video', videoSchema);
module.export = Video;