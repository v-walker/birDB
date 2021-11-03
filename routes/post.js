const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');
const db = require('../models');

router.get('/post', (req, res) => {
    res.render("post");
});

// GET /post/:postID
router.get("/post/:postID", async (req, res) => {
    let postID = req.params.postID;

    let post = await db.posts.findByPk(postID);
    let comments = await db.comments.findAll({where: {postID: postID}});
    let data = [post, comments]
    // data structure??? [{}, {}]

    res.json(data);
});

router.put('/post/:postID', async (req, res) => {
    let postID = req.params.postID;

    // pulling updated information from edit
    let {title, observation, imgURL} = req.body;
    await db.posts.update({title: title, observation: observation, imgURL: imgURL}, {where: {id: postID}});

    let post = await db.posts.findByPk(postID);
    let comments = await db.comments.findAll({where: {postID: postID}});

    let data = [post, comments]

    res.json(data)
});

router.delete('/post/:postID', async (req, res) => {
    let postID = req.params.postID;

    await db.posts.destroy({where: {id: postID}});
    // redirect to home/landing page
    res.redirect('/');
});

// router.post('/post/:postID', async (req, res) => {
//     let postID = req.params.postID;
//     let {username, contents} = req.body;
    
//     // allow to post new comment to db (associated with a post)
//     await db.comments.create({postID: postID, username: username, contents: contents, likes: '0'});
    
//     let post = await db.posts.findByPk(postID);
//     let comments = await db.comments.findAll({where: {postID: postID}});

//     res.json(post, comments)
// });

// // editing comment
// router.put('/post/:commentID', async (req, res) => {
//     let commentID = req.params.commentID;
//     let {updatedContents, postID} = req.body;

//     await db.comments.update({contents: updatedContents}, {where: {id: commentID}});

//     let post = await db.posts.findByPk(postID);
//     let comments = await db.comments.findAll({where: {postID: postID}});

//     res.json(post, comments);
// });

// router.delete('/post/:commentID', async (req, res) => {
//     let commentID = req.params.commentID;
//     let postID = req.body.postID

//     await db.comments.destroy({where: {id: commentID}});

//     let post = await db.posts.findByPk(postID);
//     let comments = await db.comments.findAll({where: {postID: postID}});

//     res.json(post, comments);
// });

module.exports = router;