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
                // console.log('in promise', result);
            res(result.dataValues.user.dataValues.username)
        }
        catch(err){
            console.log(err);
        }
    })
};

async function userArray(arr) {
    usernameArr = [];
    // dates = [];
    for (let i = 0; i < arr.length; i++) {
        const post = arr[i];
        const id = post.id;
        const result = await getUsername(post, id);
        usernameArr.push(result);
    }
    return usernameArr;
};

router.get('/', gatekeeper, async (req,res) => {
    let dates = [];
    let date = new Date();
    date.setDate(date.getDate() - 3);

    console.log(date);
    users = []
    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        }
    });

    let usernames = await userArray(recentPosts)
    console.log('username list stuff', usernames);
})

router.get('/', gatekeeper, async (req,res) => {
    let recentPosts = await db.posts.findAll(); //need to put back date stuff
    let usernames = await userArray(recentPosts)
    console.log('username list stuff', usernames);
    res.render('index', {
        usernames: usernames,
        username: record.username,
        recentPosts: recentPosts
    });
});

router.get('/blogs', async (req,res) => {
    //put gatekeeper to get user id
    let date = new Date()
    date.setDate(date.getDate() - 3)
    console.log(date);

    // let recentPosts = await db.posts.findAll(
    //     {
    //     where: {
    //         createdAt: {
    //             [Op.gte]: date
    //         }
    //     },
    //      include: {}
    // }
    // );
    let posts = await db.posts.findAll({include: [{
        model: db.users,
        required: true
    }]})


    recentPosts.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": rawDate.getMonth(), 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
        
    });

    console.log(recentPosts);
    console.log("---------");
    console.log(usernames);
    console.log("-------");
    console.log(dates);

    res.render('index', {
        username: MediaRecorder.username,
        recentPosts: recentPosts,
        dates: dates,
        users: usernames
    });
});

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
});

module.exports = router;
