const express = require('express');
const router = express.Router();
const gatekeeper =  require('../auth');
const db = require('../models');

router.get('/chat', gatekeeper, async (req,res) => {

let record = await db.users.findByPk(req.user.id)
console.log(req.user);
    res.render('chat',
    {
        username: record.username
    })

    req.session.record = record
    console.log(record);
})
module.exports = router;