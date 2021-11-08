const express = require('express');
const router = express.Router();
const gatekeeper =  require('../auth');
const db = require('../models');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

// will refactor redundancies in http request methods later, but all information is currently being passed properly

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
let date = new Date();
    
date.setDate(date.getDate() - 3);


function getUsername(post, id) {
    return new Promise(async (res, _rej) => {
        try{
            let post = await db.posts.findByPk(id);
            // console.log(post);
            let userID = post.userID;
            let result = await db.users.findByPk(userID);
            // console.log(`Full result: ${result.dataValues.username}`);
            res(result.dataValues.username)
        }
        catch(err){
            console.log(err);
        }
    })
};

function getFollowingUsers(id) {
    return new Promise(async (res, _rej) => {
        try {
            let result = await db.users.findByPk(id)
            // console.log(result);
            let userObj = {id: result.id, username: result.username}
            res(userObj)
        } catch(err) {
            console.log(err);
        }
    })
};

// function userOrFollow(post, option){
//     return new Promise(async (res, _rej) => {
//         try {
//             if(option == "username"){
//                 console.log('if');
//                 const id = post.userID
//                 res(id)
//             } 
//             else{
//                 console.log('else');
//                 const id = post.id
//                 res(id)
//             }
//         } catch(err) {
//             console.log(err);
//         }
//     })
// }

function getDates(arr) {
    let dates = [];
    arr.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": monthNames[rawDate.getMonth()], 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
    });
    return dates;
};

async function getRecentPosts(date) {
    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        },
        limit: 2
    });
    return recentPosts
}

async function arrayIterator(arr, action) {
    manipulatedArray = [];
    for (let i = 0; i < arr.length; i++) {
        const post = arr[i];
        const id = post.id;
        const result = await action(post, id);
        manipulatedArray.push(result);
    }
    return manipulatedArray;
};

// don't need this anymore? yes
router.get('/post/', gatekeeper,(req, res) => {
    console.log('first');
    let postID = req.params.postID;
    res.render("hunterPost", {
        postID: postID
    });
});

// GET /post/:postID
router.get("/post/:postID", gatekeeper,async (req, res) => {
    try {
        console.log('second');
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
        let commentDates = getDates(comments)


        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);
        let object =  {
            postID: postID,
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

        };
        res.json(object)
    } catch {
        console.log('Error getting post');
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
    } catch {
        console.log("error while updating post");
        res.render("post", {
            error: "Error while updating post."
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
    } catch {
        console.log("error while deleting post");
        res.render('post', {
            error: "Error occurred while deleting post"
        })
    }
});

// add a comment to selected post
router.post('/post/:postID', gatekeeper, async (req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);
        let postID = req.params.postID;
        let {contents} = req.body;
        
        // allow to post new comment to db (associated with a post)
        await db.comments.create({postID: postID, username: record.username, contents: contents, likes: '0'});
        // let allComments = db.comments.findByPk(commentID)
        // console.log(newComment);

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
        let commentDates = getDates(comments)

        // recent posts
        let recentPosts = await getRecentPosts(date);
        let dates = getDates(recentPosts);
        let usernames = await arrayIterator(recentPosts, getUsername);

        // res.json(allComments)
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
        console.log("Error while creating new comment");
        res.render("post", {
            error: "Error occurred while creating new comment"
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
        console.log("Error occurred while updating comment");
        res.render("post", {
            error: "Error occurred while updating comment"
        })
    }
});

// deleting a comment
router.delete('/post/:postID/:commentID', async (req, res) => {
    try {
        console.log('in delete');
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

        // res.redirect(`/post/${postID}`)
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
        console.log("Error occurred while deleting comment");
        res.render("post", {
            error: "Error occurred while deleting comment"
        })
    }
});

module.exports = router;