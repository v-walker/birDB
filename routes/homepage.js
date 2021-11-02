const express = require('express');
const router = express.Router()
const gatekeeper =  require('../auth');

router.get('/homepage', (req,res) => {

    res.render('/homepage')
})
module.exports = router;