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
    
    res.render('index', {
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

    let userRecord = await db.users.findByPk(1) //req.user.id 
    console.log(userRecord);
    // let followingUsers = userRecord.following
    res.json(posts)
})

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
