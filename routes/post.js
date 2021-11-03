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
    // data structure??? [{}, {}]

    res.json(post, comments);
})


router.put('/post/:postID', (req, res) => {
    let postID = req.params.postID;

    // query db for postID;
    
    let post = await db.posts.findByPk(postID);
    // check sessionID is valid for user
    // if sessionID matches userID for post, then allow for editing; else, error

});

router.delete('/post/:postID', (req, res) => {
    let postID = req.params.postID;

    // Check session ID; if match, allow to delete, else error
    await db.posts.destroy({where: {id: postID}});
    // redirect to home/landing page
    res.redirect('/');
});

router.post('/post/:postID', (req, res) => {
    let postID = req.params.postID;
    let {username, contents} = req.body;
    
    // allow to post new comment to db (associated with a post)
    await db.comments.create({postID: postID, username: username, contents: contents, likes: '0'});
    
    let records = await db.comments.findAll({where: {postID: postID}});
    res.json(records);
});

router.put('/post/:commentID', (req, res) => {
    let commentID = req.params.commentID;

    // allow to edit comments associated with post
});

router.delete('/post/:commentID', (req, res) => {

});

module.exports = router;