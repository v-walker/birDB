const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');
const db = require('../models');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

router.get('/', async (req,res) => {
    let date = new Date()
    date.setDate(date.getDate() - 3)
    console.log(date);

    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        }
    });

    // let recentPostswithUsers = await db.posts.findAll({
    //     where: {
    //         createdAt: {
    //             [Op.gte]: date
    //         }
    //     },
    //     include: [{
    //         model: db.users,
    //         required: true
    //     }]
    // });
    
    // console.log(recentPosts);
    // data structure: [posts {dataValues: {id: num, title: 'string', ... user: []}, _previousDataValues: {}, ...}]
    // console.log(recentPostswithUsers[0].dataValues.user);
    // let recentPosts = recentPostswithUsers[0].dataValues
    // let users = recentPostswithUsers[0].dataValues.user.dataValues
    console.log(recentPosts);
    console.log("---------");
    console.log(users);

    let dates = []
    let users = []

    // let testDate = recentPostswithUsers[0].dataValues.createdAt
    // console.log(testDate);

    recentPosts.forEach(post => {
        dates.push(post.dataValues.createdAt)
        
    });
    console.log("-------");
    console.log(dates);

    recentPosts.forEach( async (post) => {
        let id = post.id
        let userObj = await db.posts.findByPk(id, {
            include: [{
                model: db.users,
                required: true
            }]})
        users.push(userObj.dataValues.user.dataValues.username);
    })


    res.render('index', {
        recentPosts: recentPosts,
        users: users
    });
});

// router.get('/blogs', async (req,res) => {
//     //put gatekeeper to get user id
//     let date = new Date()
//     date.setDate(date.getDate() - 3)
//     console.log(date);

//     // let recentPosts = await db.posts.findAll(
//     //     {
//     //     where: {
//     //         createdAt: {
//     //             [Op.gte]: date
//     //         }
//     //     },
//     //      include: {}
//     // }
//     // );
//     let posts = await db.posts.findAll({include: [{
//         model: db.users,
//         required: true
//     }]})

//     let userRecord = await db.users.findByPk(1) //req.user.id 
//     console.log(userRecord);
//     // let followingUsers = userRecord.following
//     res.json(posts)
// })

//need to figure out if multi posts from one user can go on index or not. might need sep route then render in the /blogs/:id and use ejs for each to build instead, can use blogSkeleton
// router.get('/blogs/:id', async (req,res) => {
//     //put gatekeeper to get user id
//     let id = req.params.id
//     let date = new Date()
//     date.setDate(date.getDate() - 3)
//     console.log(date);

//     // let recentPosts = await db.posts.findAll(
//     //     {
//     //     where: {
//     //         createdAt: {
//     //             [Op.gte]: date
//     //         }
//     //     },
//     //      include: {}
//     // }
//     // );
//     let posts = await db.posts.findAll({
//         where: {
//             userID: id
//         },
//         include: [{
//             model: db.users,
//             required: true
//     }]})

//     // let userRecord = await db.users.findByPk(1) //req.user.id 
//     // console.log(userRecord);
//     // let followingUsers = userRecord.following
//     res.json(posts)
// })

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
});

module.exports = router;
