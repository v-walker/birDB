const express = require("express");
const router = express.Router();
const gatekeeper =  require("../auth");
const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {getIndividualPostData, getRecentPostData} = require("../modules/lib")

let date = new Date();
date.setDate(date.getDate() - 3);

// GET /post/:postID
router.get("/post/:postID", gatekeeper,async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;

        // for individual post
        let {post, postUsername, comments, following, formattedDate, commentDates} = await getIndividualPostData(record, postID);

        // for recent posts
        let {recentPosts, dates, usernames} = await getRecentPostData(date);
        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
            commentDates: commentDates,
            date: formattedDate,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames

        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// edit selected post
router.put('/post/:postID', async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;

        // pulling updated information from edit
        let {title, observation, imgURL} = req.body;
        await db.posts.update({title: title, observation: observation, imgURL: imgURL}, {where: {id: postID}});

        // for individual post
        let {post, postUsername, comments, following, formattedDate, commentDates} = await getIndividualPostData(record, postID);

        // for recent posts
        let {recentPosts, dates, usernames} = await getRecentPostData(date);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
            commentDates: commentDates,
            date: formattedDate,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames
        });
    } catch (err) {
        console.log(err);
        res.render("post", {
            error: err
        })
    }
});

// delete selected post
router.delete('/post/:postID', async (req, res) => {
    try {
        let postID = req.params.postID;

        await db.posts.destroy({where: {id: postID}});
        // redirect to home/landing page
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.render('post', {
            error: err
        })
    }
});

// add a comment to selected post
router.post('/post/:postID/', gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let {contents} = req.body;
        
        // allow to post new comment to db (associated with a post)
        await db.comments.create({postID: postID, username: record.username, contents: contents, likes: '0'});
        
        // for individual post
        let {post, postUsername, comments, following, formattedDate, commentDates} = await getIndividualPostData(record, postID);

        // for recent posts
        let {recentPosts, dates, usernames} = await getRecentPostData(date);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
            commentDates: commentDates,
            date: formattedDate,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames
        });
    } catch (err) {
        console.log(err);
        res.render("post", {
            error: err
        })
    }
});

// editing comment
router.put('/post/:postID/:commentID', async (req, res) => {
    try {
        // let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID
        let commentID = req.params.commentID;
        let updatedContents = req.body.updatedContents;

        await db.comments.update({contents: updatedContents}, {where: {id: commentID}});

        // for individual post
        let {post, postUsername, comments, following, formattedDate, commentDates} = await getIndividualPostData(record, postID);

        // for recent posts
        let {recentPosts, dates, usernames} = await getRecentPostData(date);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
            commentDates: commentDates,
            date: formattedDate,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames
        });
    } catch {
        console.log(err);
        res.render("post", {
            error: err
        })
    }
});

// deleting a comment
router.delete('/post/:postID/:commentID', gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let commentID = req.params.commentID;

        await db.comments.destroy({where: {id: commentID}});

        // for individual post
        let {post, postUsername, comments, following, formattedDate, commentDates} = await getIndividualPostData(record, postID);
        
        // for recent posts
        let {recentPosts, dates, usernames} = await getRecentPostData(date);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
            commentDates: commentDates,
            date: formattedDate,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames
        });
    } catch {
        console.log(err);
        res.render("post", {
            error: err
        })
    }
});

module.exports = router;
