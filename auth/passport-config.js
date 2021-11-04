const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');
const init = (passport) => {
    passport.use(new LocalStrategy({usernameField:'email'}, async (email,password,done) => {
        try{
            let records = await db.users.findAll({where: {email:email}}); //array of objects
            if(records){
                let record = records[0]
                bcrypt.compare(password, record.password,(err,match) => {
                    if(match){
                        return done(null,record);
                    }else{
                        return done(null,false)
                    }
                })
            }else{
                return done(null,false)
            }
        }catch(err){ 
            return done(err)
        }
    }))
    passport.serializeUser((user,done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async(id,done) => {
        
        let userInDatabase = await db.users.findByPk(id); 
        
        if(userInDatabase){
            done(null, userInDatabase)
        }
        else{
            done(null, false)
        }
    })
}
module.exports = init