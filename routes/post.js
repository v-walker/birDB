const express = require("express");
const router = express.Router();
const gatekeeper =  require("../auth");
const db = require("../models");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const {monthNames, getUsername, getFollowingUsers, getDates, getRecentPosts, arrayIterator} = require("../modules/lib")

let date = new Date();
date.setDate(date.getDate() - 3);

// const getIndividualPostData = (record, post, postID) => {
//     return new Promise(async (res, _rej) => {
//         try {
//             let postUserID = post.dataValues.userID;
//             let postUser = await db.users.findByPk(postUserID);
//             let postUsername = postUser.username;
//             let comments = await db.comments.findAll({where: {postID: postID}});
//             let followingIDList = (record.following !== null)? record.following.split(','): [];
//             let following = await arrayIterator(followingIDList, getFollowingUsers);
//             let rawDate = post.dataValues.createdAt;
//             let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};
//             res({postUsername, comments, following, formattedDate})
//         } catch (err) {
//             console.log(err);
//         }
//     });
// };

// GET /post/:postID
router.get("/post/:postID", gatekeeper,async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;

        // for individual post
        let post = await db.posts.findByPk(postID);
        let postUserID = post.dataValues.userID;
        let postUser = await db.users.findByPk(postUserID);
        let postUsername = postUser.username;
        let comments = await db.comments.findAll({where: {postID: postID}});
        let followingIDList = (record.following !== null)? record.following.split(','): [];
        let following = await arrayIterator(followingIDList, getFollowingUsers);
        let rawDate = post.dataValues.createdAt;
        let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};
        // let {postUsername, comments, following, formattedDate} = getIndividualPostData(record, post, postID);
        // console.log(`postUsername: ${postUsername}`);
        // console.log("----------");
        // console.log(`comments: ${comments}`);
        // console.log("----------");
        // console.log(`following: ${following}`);
        // console.log("----------");
        // console.log(`formattedDate: ${formattedDate}`);
        // console.log("----------");

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
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

        // individual post
        let post = await db.posts.findByPk(postID);
        let postUserID = post.dataValues.userID;
        let postUser = await db.users.findByPk(postUserID);
        let postUsername = postUser.username;
        let comments = await db.comments.findAll({where: {postID: postID}});
        let followingIDList = (record.following !== null)? record.following.split(','): [];
        let following = await arrayIterator(followingIDList, getFollowingUsers);
        let rawDate = post.dataValues.createdAt;
        let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
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
router.post('/post/:postID', async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let {username, contents} = req.body;
        
        // allow to post new comment to db (associated with a post)
        await db.comments.create({postID: postID, username: username, contents: contents, likes: '0'});
        
        // individual post
        let post = await db.posts.findByPk(postID);
        let postUserID = post.dataValues.userID;
        let postUser = await db.users.findByPk(postUserID);
        let postUsername = postUser.username;
        let comments = await db.comments.findAll({where: {postID: postID}});
        let followingIDList = (record.following !== null)? record.following.split(','): [];
        let following = await arrayIterator(followingIDList, getFollowingUsers);
        let rawDate = post.dataValues.createdAt;
        let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
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

        // individual post
        let post = await db.posts.findByPk(postID);
        let postUserID = post.dataValues.userID;
        let postUser = await db.users.findByPk(postUserID);
        let postUsername = postUser.username;
        let comments = await db.comments.findAll({where: {postID: postID}});
        let followingIDList = (record.following !== null)? record.following.split(','): [];
        let following = await arrayIterator(followingIDList, getFollowingUsers);
        let rawDate = post.dataValues.createdAt;
        let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
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
router.delete('/post/:postID/:commentID', async (req, res) => {
    try {
        // let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let commentID = req.params.commentID;

        await db.comments.destroy({where: {id: commentID}});

        // individual post
        let post = await db.posts.findByPk(postID);
        let postUserID = post.dataValues.userID;
        let postUser = await db.users.findByPk(postUserID);
        let postUsername = postUser.username;
        let comments = await db.comments.findAll({where: {postID: postID}});
        let followingIDList = (record.following !== null)? record.following.split(','): [];
        let following = await arrayIterator(followingIDList, getFollowingUsers);
        let rawDate = post.dataValues.createdAt;
        let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        res.render("post", {
            username: record.username,
            userID: record.id,
            following: following,
            post: post,
            postUsername: postUsername,
            comments: comments,
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