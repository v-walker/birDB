const express = require('express');
const router = express.Router();
const gatekeeper =  require('../auth');


router.get('/userpage', (req,res) => {

    res.render('userpage')
})

module.exports = router;