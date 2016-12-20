const Article = require('mongoose').model('Article');
const express = require('express');

module.exports = {
    commentGet: (req, res) => {
        //
        Comment.find({}).then(comment)
    }
};