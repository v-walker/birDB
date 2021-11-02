const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');

router.get('/404', (req,res) => {

    res.render('404')
})
module.exports = router;