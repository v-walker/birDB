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

        // query users table by searchString for username; return result to front-end

        res.render("search", {
            username: record.username,
            userID: record.id,
            // send arrays of both sets of query data back here
            // also send: following, recent posts, dates for recent posts, and usernames for recent posts
        })


    } catch(err) {
        console.log(err);
    };

})



module.exports = router;