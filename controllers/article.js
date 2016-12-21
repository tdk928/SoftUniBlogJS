const Article = require('mongoose').model('Article');
const Category = require('mongoose').model('Category');
const initializeTags = require('./../models/Tag').initializeTags;
const express = require('express');
const fileUpload = require('express-fileupload');
const Video = require('mongoose').model('Video');
const Comment = require('mongoose').model('Comment');

module.exports = {
    createGet: (req, res) => {
        Category.find({}).then(categories => {
            res.render('article/create', {categories: categories});
        });
    },
    createPost: (req, res) => {
        let articleArgs = req.body;
        let errorMsg = '';

        if (!req.isAuthenticated()) {
            errorMsg = 'You should be logged in to make articles!'
        } else if (!articleArgs.title) {
            errorMsg = 'Invalid title!';
        } else if (!articleArgs.content) {
            errorMsg = 'Invalid content!';
        }

        if (errorMsg) {
            res.render('article/create', {error: errorMsg});
            return;
        }

        articleArgs.author = req.user.id;
        articleArgs.tags = [];

        let file;

        file = req.files.file;

        if (file && file.data.length) {
            file.mv(`./public/uploadFiles/${file.name}`, function (err) {

            });

            articleArgs.imagePath = `/uploadFiles/${file.name}`;
        }

        Article.create(articleArgs).then(article => {
            let tagNames = articleArgs.tagNames.split(/\s+|,/).filter(tag => {
                return tag
            });
            initializeTags(tagNames, article.id);
            article.prepareInsert();
            res.redirect('/user/forum');
        });


    },
    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author tags comments').then(article => {
            if (!req.user) {
                res.render('article/details', {article: article, isUserAuthorized: false});
                return;
            }

            req.user.isInRole('Admin').then(isAdmin => {
                let isUserAuthorized = isAdmin || req.user.isAuthor(article);

                res.render('article/details', {article: article, isUserAuthorized: isUserAuthorized});
            });
        });
    },
    editGet: (req, res) => {
        let id = req.params.id;

        //ако не сме логнати -> след като се логнем се връщаме на URL където сме били
        if (!req.isAuthenticated()) {
            let returnUrl = `/article/edit/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).populate('tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }

                Category.find({}).then(categories => {
                    article.categories = categories;
                    article.tagNames = article.tags.map(tag => {
                        return tag.name
                    });
                    res.render('article/edit', article)
                });
            });
        });

    },

    editPost: (req, res) => {
        let id = req.params.id;

        let articleArgs = req.body;

        let errorMsg = '';
        if (!articleArgs.title) {
            errorMsg = 'Article title cannot be empty!';
        } else if (!articleArgs.content) {
            errorMsg = 'Article content cannot be empty'
        }
        if (errorMsg) {
            // i tva sa proverki dali e prazno
            res.render('article/edit', {error: errorMsg})
        } else {
            Article.findById(id).populate('category').populate('tags').then(article => {
                if (article.category.id !== articleArgs.category) {
                    article.category.articles.remove(article.id);
                    article.category.save();
                }//tva mai e za tursa4ka po tagove
                article.category = articleArgs.category;
                article.title = articleArgs.title;
                article.content = articleArgs.content;

                let newTagNames = articleArgs.tags.split(/\s+|,+/).filter(tag => {
                    return tag;
                });
                let oldTags = article.tags
                    .filter(tag => {
                        return newTagNames.indexOf(tag.name) === -1;
                    });
                for (let tag of oldTags) {
                    tag.deleteArticle(article.id);
                    article.deleteTag(tag.id);
                }
                initializeTags(newTagNames, article.id);

                Category.findById(article.category).then(category => {
                    if (category.articles.indexOf(article.id) === -1) {
                        category.articles.push(article.id);
                        category.save();
                    }
                    res.redirect(`/article/details/${id}`)
                })
            });
        }
    },
    deleteGet: (req, res) => {
        //user-a го е подал  в URL и го вземам от там
        let id = req.params.id;
        if (!req.isAuthenticated()) {
            let returnUrl = `/article/delete/${id}`;
            req.session.returnUrl = returnUrl;

            res.redirect('/user/login');
            return;
        }

        //намери ми това ИД което си взел от URL , и ми върни неговите тагове/артикали
        Article.findById(id).populate('category tags').then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/');
                    return;
                }
                article.tagNames = article.tags.map(tag => {
                    return tag.name
                });
                res.render('article/delete', article)
            });
        });
    },
    deletePost: (req, res) => {
        let id = req.params.id;

        //намери ми по ИД което сме взели от URL/базата, върни ми го и след като свършиш с задачите(populate -> вземи ми инфо за автора) го изтрии
        Article.findOneAndRemove({_id: id}).populate('author').then(article => {
            article.prepareDelete();
            res.redirect('/user/forum');
        });
    },
    postComment: (req, res) => {
        let articleId = req.params.id;

        let commentArgs = req.body;

        if (commentArgs) {
            let article = Article.findById(articleId).then(article => {
                if (!req.user) {
                    res.redirect('/user/login');
                }

                commentArgs.article = article.id;
                commentArgs.author = req.user.id;

                Comment.create(commentArgs).then(comment => {
                    article.comments.push(comment.id);
                    article.save();

                    res.redirect(`/article/details/${articleId}`)
                });
            });
        }
    },

    videoGet: (req, res) => {
        Video.find().then(videos => {
            res.render('user/video', {videos: videos});
        });
    },

    videoPost: (req, res) => {


        let file;
        let videoArgs = req.body;
        videoArgs.author = req.user.id;

        file = req.files.file;

        if (file && file.data.length) {
            file.mv(`./public/uploadVideos/${file.name}`, function (err) {
            });

            videoArgs.videoPath = `/uploadVideos/${file.name}`;
            Video.create(videoArgs).then(()=> {
                res.redirect('/user/video');
            });
        }
    }

};