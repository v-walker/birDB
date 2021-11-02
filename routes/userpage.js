const express = require('express');
const router = express.Router()

router.get('/userpage', (req,res) => {


    res.render('userpage')
})
