let authRequest = (req, res, next)=>{
    let auth = req.isAuthenticated(); 
    if(auth){
        next()
    }
    else{
        res.redirect('/login')
    }
}
module.exports = authRequest;