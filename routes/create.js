const express = require("express");
const router = express.Router()
const gatekeeper = require('../auth');
const formidable = require('formidable');
const cloudinary = require("cloudinary");
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
    const form = new formidable.IncomingForm();
    let uploadFolder = path.join(__dirname, "../public", "files")
    form.uploadDir = uploadFolder
    form.parse(req, (err, fields, files) => {
        if (err) {
            next()
            return
        }
        cloudinary.uploader.upload(files.upload.filepath, result => {
            console.log("this is the result", result)
            if (result.public_id) {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write('received upload:\n\n');
                res.end(JSON.stringify({ fields: fields, files: files }));
            }
        })
        fs.unlinkSync(files.upload.filepath);
    });
    
});

module.exports = router