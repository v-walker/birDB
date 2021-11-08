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
            let result = await db.users.findByPk(id);
            let userObj = {id: result.id, username: result.username};
            res(userObj);
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
        limit: 2,
        order: [['id', 'DESC']]
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

const getIndividualPostData = (record, postID) => {
    return new Promise(async (res, _rej) => {
        try {
            let post = await db.posts.findByPk(postID);
            let postUserID = post.dataValues.userID;
            let postUser = await db.users.findByPk(postUserID);
            let postUsername = postUser.username;
            let comments = await db.comments.findAll({where: {postID: postID}});
            let followingIDList = (record.following !== null)? record.following.split(','): [];
            let following = await arrayIterator(followingIDList, getFollowingUsers);
            let rawDate = post.dataValues.createdAt;
            let formattedDate = {"month": monthNames[rawDate.getMonth()], "day": rawDate.getDate()};
            let commentDates = await getDates(comments);
            res({post: post, postUsername: postUsername, comments: comments, following: following, formattedDate: formattedDate, commentDates: commentDates});
        } catch (err) {
            console.log(err);
        }
    });
};

const getRecentPostData = (date) => {
    return new Promise(async (res, _rej) => {
        try {
            let recentPosts = await getRecentPosts(date);
            let dates = getDates(recentPosts);
            let usernames = await arrayIterator(recentPosts, getUsername);
            res({recentPosts: recentPosts, dates: dates, usernames: usernames});
        } catch (err) {
            console.log(err);
        }
    })
};

module.exports = {monthNames, getUsername, getFollowingUsers, getDates, getRecentPosts, arrayIterator, getIndividualPostData, getRecentPostData};