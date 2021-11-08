const express = require("express");
const router = express.Router()
const gatekeeper =  require("../auth");
const db = require("../models");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const {monthNames, getUsername, getFollowingUsers, arrayIterator} = require("../modules/lib");

let date = new Date();
// three days back
date.setDate(date.getDate() - 3);

router.get('/', gatekeeper, async (req, res) => {
    let record = await db.users.findByPk(req.user.id);
    let dates = [];
    
    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        },
        order: [['id', 'DESC']]
    });

    let usernames = await arrayIterator(recentPosts, getUsername);
    let followingIDList = (record.following !== null)? record.following.split(','): [];
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
        following: following,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames
    });
});

router.get('/user/:userPostsID', gatekeeper, async (req, res) => {
    let userPostsID = req.params.userPostsID
    let record = await db.users.findByPk(req.user.id);
    let dates = [];
    
    let recentPosts = await db.posts.findAll({where: {userID: userPostsID} });

    let usernames = await arrayIterator(recentPosts, getUsername);
    let followingIDList = (record.following !== null)? record.following.split(','): [];
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
    if (record.following){
        unsplitFollowing += `,${userPostsID}`
        console.log('not null', unsplitFollowing);
    } else {
        unsplitFollowing = userPostsID
        console.log('null', unsplitFollowing);
    }
    date.setDate(date.getDate() - 3);
    
    await db.users.update({following: unsplitFollowing}, {where: {id: userID}});
    
    let updatedRecord = await db.users.findByPk(req.user.id);

    let recentPosts = await db.posts.findAll({where: {userID: userPostsID} });
    
    let usernames = await arrayIterator(recentPosts, getUsername);
    let followingIDList = updatedRecord.following.split(',');
    // if (followingIDList.includes(userPostsID) !== true){
        //     let unsplitFollowing = record.following
        //     unsplitFollowing += `,${userPostsID}`
        // }
    let following = await arrayIterator(followingIDList, getFollowingUsers);
        
        
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
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
        following: following,
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