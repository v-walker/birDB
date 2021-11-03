const express = require('express');
const app = express();
const helmet = require('helmet');
const socket = require('socket.io');
const PORT = process.env.PORT || 3000;
const cookieSession = require('cookie-session');
const { find } = require('async');
const passport = require('passport');
require('./auth/passport-config')(passport);


app.set('view engine','ejs')
app.use(express.static('public'));
app.use(
    helmet({
    contentSecurityPolicy: false,
    })
);
app.use(cookieSession({
    name:'session',
    keys:['CaptainJacobKeyes'],
    maxAge: 14*24*60*60*1000
}))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

app.use(require('./routes/index'))
app.use(require('./routes/homepage'))
app.use(require('./routes/userpage'))
app.use(require('./routes/about'))
app.use(require('./routes/chat'))
app.use(require('./routes/404'))
app.use(require('./routes/login'))
app.use(require('./routes/registration'))




let server = app.listen(PORT,() => {
    console.log(`Listening on ${PORT}`);
    
})  

let io = socket(server)


io.on('connection', (socket) => {
    console.log('client connected');
    socket.on('postMessage', (clientMsg) => {    //listens for incoming chat messages

        io.emit('updateMessage',clientMsg) //broadcasts back out to all the clients
        
    })
})

