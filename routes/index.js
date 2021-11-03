const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');

router.get('/', (req,res) => {
    res.render('index')
});

router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
});

module.exports = router;
