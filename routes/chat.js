const express = require('express');
const router = express.Router();
const gatekeeper =  require('../auth');
const db = require('../models');

router.get('/chat', gatekeeper, async (req,res) => {

let record = await db.users.findByPk(req.user.id)

    res.render('chat',
    {
        username: record.username,
        userID: record.id
    })

    req.session.record = record
    console.log(record);
})
module.exports = router;