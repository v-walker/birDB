const express = require("express");
const router = express.Router()
const gatekeeper = require('../auth');
const formidable = require('formidable');
const cloudinary = require("cloudinary");
const db = require('../models');
const path = require("path")
const fs = require("fs")
require('dotenv').config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

router.get("/create", gatekeeper, async (req, res) => {

    let record = await db.users.findByPk(req.user.id)
    res.render("create",
    {
        username: record.username,
        userID: record.id
    }
    )
})

router.post('/create', gatekeeper, async (req, res, next) => {
    let userID = req.user.id
    const form = new formidable.IncomingForm();
    let uploadFolder = path.join(__dirname, "../public", "files")
    form.uploadDir = uploadFolder
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next()
            return
        }
        // await db.posts.create({title: fields.title, commonName: fields.common, scientificName: fields.scientific, location: fields.location, precipitation: fields.precip, temperature: fields.temp, cloudCover: fields.cloud, observation: fields.observation, likes: "0", userID: userID, imgURL: "www.bird.com"})
        cloudinary.uploader.upload(files.upload.filepath, async result => {
            // console.log("this is the result", result)
            await db.posts.create({title: fields.title, commonName: fields.common, scientificName: fields.scientific, location: fields.location, precipitation: fields.precip, temperature: fields.temp, cloudCover: fields.cloud, observation: fields.observation, likes: "0", userID: userID, imgURL: result.secure_url})
            // await db.posts.update({imgURL: result.secure_url}, {where: {imgURL: "www.bird.com"}});
        })
        fs.unlinkSync(files.upload.filepath);
    });
    res.redirect("/")
});

module.exports = router