const express = require("express");
const router = express.Router()
const gatekeeper =  require("../auth");
const db = require("../models");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;
const {monthNames, getUsername, getFollowingUsers, arrayIterator} = require("../modules/lib")

router.get('/', gatekeeper, async (req,res) => {
    let record = await db.users.findByPk(req.user.id);
    let dates = [];
    let date = new Date();
    
    date.setDate(date.getDate() - 3);
    
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
        following: following,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames
    });
});

router.get('/user/:userPostsID', gatekeeper, async (req,res) => {
    let userPostsID = req.params.userPostsID
    let record = await db.users.findByPk(req.user.id);
    let dates = [];
    let date = new Date();
    
    date.setDate(date.getDate() - 3);
    
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