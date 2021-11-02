const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');

router.get('/about', (req,res) => {

    res.render('about')
})
module.exports = router;
