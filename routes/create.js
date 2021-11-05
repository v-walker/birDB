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

router.get("/create", gatekeeper, async(req, res) => {
    
    let record = await db.users.findByPk(req.user.id)
    res.render("create",
    {
        username: record.username
    }
    )
})

router.post('/create', (req, res, next) => {
    // pulls encrypted form from header and parses out with formidable
    const form = new formidable.IncomingForm();
    let uploadFolder = path.join(__dirname, "../public", "files")
    form.uploadDir = uploadFolder
    form.parse(req, (err, fields, files) => {
        if (err) {
            next()
            return
        }
        console.log(fields)
        // uploads image to cloudinary and deletes temp file with fs
        cloudinary.uploader.upload(files.upload.filepath, result => {
            console.log("this is the result", result)
            console.log(result.secure_url)
        })
        fs.unlinkSync(files.upload.filepath);
        // end image upload functionality
        
    });
    res.redirect("/")
});

module.exports = router