const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');
const db = require('../models');

// don't need this anymore? yes
// router.get('/post', gatekeeper,(req, res) => {
//     res.render("post");
// });

// GET /post/:postID
router.get("/post/:postID",gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;

        let post = await db.posts.findByPk(postID);
        let comments = await db.comments.findAll({where: {postID: postID}});
        let following = (record.following !== null)? record.following.split(','): [];

        res.render("post", {
            username: record.username,
            following: following,
            post: post,
            comments: comments
        });
    } catch {
        console.log('Error getting post');
        res.redirect('/')
    }
});

// edit selected post
router.put('/post/:postID', gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        // pulling updated information from edit
        let {title, observation, imgURL} = req.body;
        await db.posts.update({title: title, observation: observation, imgURL: imgURL}, {where: {id: postID}});

        let post = await db.posts.findByPk(postID);
        let comments = await db.comments.findAll({where: {postID: postID}});

        res.render("post", {
            username: record.username,
            post: post,
            comments: comments
        });
        // res.json({post, comments});
    } catch {
        console.log("error while updating post");
        res.render('post', {
            error: "Error while updating post."
        })
    }
});

// delete selected post
router.delete('/post/:postID',gatekeeper, async (req, res) => {
    try {
        let postID = req.params.postID;

        await db.posts.destroy({where: {id: postID}});
        // redirect to home/landing page
        res.redirect('/');
    } catch {
        console.log("error while deleting post");
        res.render('post', {
            error: "Error occurred while deleting post"
        })
    }
});

// add a comment to selected post
router.post('/post/:postID',gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let {username, contents} = req.body;
        
        // allow to post new comment to db (associated with a post)
        await db.comments.create({postID: postID, username: username, contents: contents, likes: '0'});
        
        let post = await db.posts.findByPk(postID);
        let comments = await db.comments.findAll({where: {postID: postID}});

        res.render("post", {
            username: record.username,
            post: post,
            comments: comments
        });
    } catch {
        console.log("Error while creating new comment");
        res.render("post", {
            error: "Error occurred while creating new comment"
        })
    }
});

// editing comment
router.put('/post/:postID/:commentID',gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID
        let commentID = req.params.commentID;
        let updatedContents = req.body.updatedContents;

        await db.comments.update({contents: updatedContents}, {where: {id: commentID}});

        let post = await db.posts.findByPk(postID);
        let comments = await db.comments.findAll({where: {postID: postID}});

        res.render("post", {
            username: record.username,
            post: post,
            comments: comments
        });
    } catch {
        console.log("Error occurred while updating comment");
        res.render("post", {
            error: "Error occurred while updating comment"
        })
    }
});

// deleting a comment
router.delete('/post/:postID/:commentID',gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let commentID = req.params.commentID;

        await db.comments.destroy({where: {id: commentID}});

        let post = await db.posts.findByPk(postID);
        let comments = await db.comments.findAll({where: {postID: postID}});

        res.render("post", {
            username: record.username,
            post: post,
            comments: comments
        });
    } catch {
        console.log("Error occurred while deleting comment");
        res.render("post", {
            error: "Error occurred while deleting comment"
        })
    }
});

module.exports = router;