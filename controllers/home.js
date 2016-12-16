const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const User = mongoose.model('User');
const Category = mongoose.model('Category');
const Tag = require('mongoose').model('Tag');
var express = require("express");
var fileUpload = require('express-fileupload');
var bodyparser = require("body-parser");
var app = express();

app.use(bodyparser.json());

module.exports = {
  index: (req, res) => {
      Category.find({}).then(categories => {
          res.render('home/index', {categories: categories});
      })
  },
    forumGet: (req, res) => {
        Category.find({}).then(categories => {
            res.render('user/forum', {categories: categories});
        });
    },
    listCategoryArticles: (req, res) => {
        let id = req.params.id;

        Category.findById(id).populate('articles').then(category => {
            User.populate(category.articles,{path: 'author'}, (err) => {
                if (err) {
                    console.log(err.message);
                }
                Tag.populate(category.articles, {path: 'tags'}, (err) => {
                    if(err) {
                        console.log(err.message);
                    }
                    res.render('home/article', {articles: category.articles})
                });

            });
        });
    },

};

// $('input[type=file]').change(function () {
//     console.log(this.files[0].mozFullPath);
// });
