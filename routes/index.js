const express = require('express');
const router = express.Router()

router.get('/', (req,res) => {


    res.render('index')
})



router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')

})

module.exports = router;
