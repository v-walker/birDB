const express = require("express");
const router = express.Router()
const gatekeeper =  require("../auth");
const db = require("../models");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const {monthNames, getUsername, getDates, getFollowingUsers, arrayIterator} = require("../modules/lib");

let date = new Date();
// three days back
date.setDate(date.getDate() - 3);

// home page data
router.get('/', gatekeeper, async (req, res) => {
    let record = await db.users.findByPk(req.user.id);
    
    let recentPosts = await db.posts.findAll({where: {createdAt: {[Op.gte]: date}}, order: [['id', 'DESC']]});

    let usernames = await arrayIterator(recentPosts, getUsername);
    let followingIDList = (record.following !== null)? record.following.split(','): [];
    let following = await arrayIterator(followingIDList, getFollowingUsers);
    let dates = getDates(recentPosts);
    
    res.render('index', {
        username: record.username,
        userID: record.id,
        following: following,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames
    });
});

// individual user posts data
router.get('/user/:userPostsID', gatekeeper, async (req, res) => {
    let userPostsID = req.params.userPostsID
    let record = await db.users.findByPk(req.user.id);
    
    // individual user posts
    let recentPosts = await db.posts.findAll({where: {userID: userPostsID} });

    let usernames = await arrayIterator(recentPosts, getUsername);
    let followingIDList = (record.following !== null)? record.following.split(','): [];
    let following = await arrayIterator(followingIDList, getFollowingUsers);
    let dates = getDates(recentPosts);
    
    res.render('index', {
        username: record.username,
        userID: record.id,
        following: following,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames
    });
});

//add follow
router.put('/user/:userPostsID', gatekeeper, async (req,res) => {
    console.log('put');
    let userPostsID = req.params.userPostsID
    let record = await db.users.findByPk(req.user.id);
    let userID = record.id
    let dates = [];
    let date = new Date();
    let unsplitFollowing = record.following
    let followingIDList = unsplitFollowing.split(',');
    if(!followingIDList.includes(userPostsID)){
        if (record.following){
            unsplitFollowing += `,${userPostsID}`
        } else {
            unsplitFollowing = userPostsID
        }
        await db.users.update({following: unsplitFollowing}, {where: {id: userID}});
    }

    date.setDate(date.getDate() - 3);
    
    let updatedRecord = await db.users.findByPk(req.user.id);

    let recentPosts = await db.posts.findAll({where: {userID: userPostsID} });
    let updatedFollowing = updatedRecord.following
    let updatedFollowingList = updatedFollowing.split(',')
    console.log(updatedFollowingList);
    let usernames = await arrayIterator(recentPosts, getUsername);
    // if (followingIDList.includes(userPostsID) !== true){
        //     let unsplitFollowing = record.following
        //     unsplitFollowing += `,${userPostsID}`
        // }
    let following = await arrayIterator(followingIDList, getFollowingUsers);
        
    recentPosts.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": monthNames[rawDate.getMonth()], 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
    });

    res.render('index', {
        username: record.username,
        userID: record.id,
        following: updatedFollowingList,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames
    });
});

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
});

module.exports = router;