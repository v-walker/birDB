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

router.get("/search/:searchString", gatekeeper, async(req, res) => {
    try {
        let record = await db.users.findByPk(req.user.id);

        let searchString = req.params.searchString;

        // query posts table by searchString for: common name, sci name; join results of both into array to be sent to front-end
        let commonQuery = await db.posts.findAll({where: {commonName: searchString}});
        console.log(`Common Query: ${commonQuery}`);
        let sciQuery = await db.posts.findAll({where: {scientificName: searchString}});
        let postsQuery = [commonQuery, sciQuery];
        // console.log(postsQuery);

        // query users table by searchString for username; return result to front-end
        let userQuery = await db.users.findAll({where: {username: searchString}});
        // console.log(userQuery);

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

        res.render("search", {
            username: record.username,
            userID: record.id,
            postsQuery: postsQuery,
            userQuery: userQuery,
            following: following,
            recentPosts: recentPosts,
            dates: dates,
            usernames: usernames

            // send arrays of both sets of query data back here
            // also send: following, recent posts, dates for recent posts, and usernames for recent posts
        });

    } catch(err) {
        console.log(err);
    };
});

module.exports = router;