const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');
const db = require('../models');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

function getUsername(post, id) {
    return new Promise(async (res, _rej) => {
        try{
            let result = await db.posts.findByPk(id, {
                include: [{
                    model: db.users,
                    required: true
                }]})
                console.log(result);
            res(result.dataValues.user.dataValues.username)
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
            let userObj = {id: result.id, username: result.username}
            res(userObj)
        } catch(err) {
            console.log(err);
        }
    })
};

function userOrFollow(post, option){
    return new Promise(async (res, _rej) => {
        try {
            if(option == "username"){
                console.log('if');
                const id = post.userID
                res(id)
            } 
            else{
                console.log('else');
                const id = post.id
                res(id)
            }
        } catch(err) {
            console.log(err);
        }
    })
}

async function arrayIterator(arr, action, option) {
    manipulatedArray = [];
    for (let i = 0; i < arr.length; i++) {
        const post = arr[i];
        const id = await userOrFollow(post, option)
        const result = await action(post, id);
        manipulatedArray.push(result);
    }
    return manipulatedArray;
};

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
        }
    });

    let usernames = await arrayIterator(recentPosts, getUsername, "username");
    let followingIDList = (record.following !== null)? record.following.split(','): [];
    let following = await arrayIterator(followingIDList, getFollowingUsers, "following");
    
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    recentPosts.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": monthNames[rawDate.getMonth()], 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
    });


    console.log(record);
    console.log("---------");
    console.log(following);
    console.log("---------");
    console.log(recentPosts);
    console.log("---------");
    console.log(usernames);
    console.log("-------");
    console.log(dates);
    
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

    let usernames = await arrayIterator(recentPosts, getUsername, "username");
    let followingIDList = (record.following !== null)? record.following.split(','): [];
    let following = await arrayIterator(followingIDList, getFollowingUsers, "following");
    
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    recentPosts.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": monthNames[rawDate.getMonth()], 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
    });


    console.log(record);
    console.log("---------");
    console.log(following);
    console.log("---------");
    console.log(recentPosts);
    console.log("---------");
    console.log(usernames);
    console.log("-------");
    console.log(dates);
    
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