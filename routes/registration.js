
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../models');


router.get('/registration', (req,res) => {

    res.render('registration')
})

router.post('/registration', async (req,res) => {
    try{
        let {username, email, password} = req.body
        passwordEncrypted = bcrypt.hashSync(password, 8); 
        await db.users.create({
            username: username, 
            email: email, 
            password: passwordEncrypted, 
            roleName: "Basic"
        })
        res.redirect('/login')
    }catch{
        console.log('error');
        res.redirect('/registration')
        res.render('registration', {
            error: "Error: Something went wrong"
        })
    }
})

module.exports = router;
