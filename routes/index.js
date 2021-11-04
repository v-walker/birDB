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
}

async function userArray(arr) {
    usernameArr = []
    for (let i = 0; i < arr.length; i++) {
        const post = arr[i];
        const id = post.id
        const result = await getUsername(post, id)
        usernameArr.push(result)
    }
    return usernameArr
}

router.get('/', async (req,res) => {
    let recentPosts = await db.posts.findAll(); //need to put back date stuff
    let usernames = await userArray(recentPosts)
    console.log('username list stuff', usernames);
    res.render('index', {
        recentPosts: recentPosts,
        usernames: usernames
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
    let posts = await db.posts.findAll({
        include: [{
            model: db.users,
            required: true
        }],
})
    // console.log(posts[0].user.dataValues.username);
    // let userRecord = await db.users.findByPk(1) //req.user.id 
    // console.log(userRecord);
    // let followingUsers = userRecord.following
    res.json(posts[0].user)
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
