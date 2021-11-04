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

    let record = await db.users.findByPk(req.user.id)
    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        }
    });

    let usernames = await userArray(recentPosts)
    console.log('username list stuff', usernames);

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
        username: record.username,
        recentPosts: recentPosts,
        dates: dates,
        usernames: usernames,
    });
});

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
});

module.exports = router;
