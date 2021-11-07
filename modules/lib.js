const express = require("express");
const db = require("../models");
const Sequelize = require("sequelize")
const Op = Sequelize.Op;

const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

function getUsername(post, id) {
    return new Promise(async (res, _rej) => {
        try{
            let post = await db.posts.findByPk(id);
            let userID = post.userID;
            let result = await db.users.findByPk(userID);
            console.log(`Full result: ${result.dataValues.username}`);
            res(result.dataValues.username)
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

function getDates(arr) {
    let dates = [];
    arr.forEach(post => {
        let rawDate = post.dataValues.createdAt
        let formattedDate = {
            "month": monthNames[rawDate.getMonth()], 
            "day": rawDate.getDate()
        }
        dates.push(formattedDate);
    });
    return dates;
};

async function getRecentPosts(date) {
    let recentPosts = await db.posts.findAll({
        where: {
            createdAt: {
                [Op.gte]: date
            }
        },
        limit: 2
    });
    return recentPosts
}

async function arrayIterator(arr, action) {
    manipulatedArray = [];
    for (let i = 0; i < arr.length; i++) {
        const post = arr[i];
        const id = post.id;
        const result = await action(post, id);
        manipulatedArray.push(result);
    }
    return manipulatedArray;
};

module.exports = {monthNames, getUsername, getFollowingUsers, getDates, getRecentPosts, arrayIterator};