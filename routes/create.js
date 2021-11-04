const express = require("express");
const router = express.Router()
const gatekeeper =  require('../auth');
const formidable = require('formidable');
const cloudinary = require("cloudinary");
const util = require('util');
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

router.get("/create", (req, res) => {
    res.render("create")
})

router.post('/create', (req, res, next) => {
    
    const form = formidable({ multiples: true });
    console.log(form)
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        cloudinary.uploader.upload(files.upload.path, result => {

            console.log(result)
            if (result.public_id) {
                res.writeHead(200, { 'content-type': 'text/plain' });
                res.write('received upload:\n\n');
                res.end(util.inspect({ fields: fields, files: files }));
            }
        }
        );
    });
});

// router.post("/create", (req, res) => {
//     console.log(req.body)

    // const form = new formidable();
    // form.parse(req, (err, fields, files) => {

    //     //https://cloudinary.com/documentation/upload_images
    //     cloudinary.uploader.upload(files.upload.path, result => {

    //         console.log(result)
    //         if (result.public_id) {
    //             res.writeHead(200, { 'content-type': 'text/plain' });
    //             res.write('received upload:\n\n');
    //             res.end(util.inspect({ fields: fields, files: files }));
    //         }
    //     }
    //     );
    // });
    // return;
// })

module.exports = router