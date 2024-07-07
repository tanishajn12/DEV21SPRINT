const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const seedDB = require('./seed');
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require("connect-flash");
const reviewRoutes = require("./routes/review");
const eventRoutes = require("./routes/event");
const registrationRoutes = require("./routes/registration")
const societyRoutes = require("./routes/society")
const contactRoute = require('./routes/contact');
const eventApi = require("./routes/eventapi");
const authRoutes = require("./routes/auth");
const profileRoutes = require('./routes/profile');
const passport= require('passport');
const User = require("./models/User");
const LocalStrategy = require('passport-local');

mongoose.connect('mongodb://127.0.0.1:27017/college') //returns a promise
.then(()=>{console.log("DB connected")})
.catch((err)=> {console.log("Error is:",err)})

app.set("view engine",'ejs')
app.set('views', path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')));

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// For parsing application/json
app.use(express.json());

app.use(methodOverride('_method'));

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly:true , 
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000
    }
}

app.use(session(configSession)); //session middleware
app.use(flash()); //flash middleware

//authentication -> passport commands -> vvimp
//make sure they are added after session
//use static serialise and deserialize of model for passport session support
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//use static authenticate method of model in Local Strategy
passport.use(new LocalStrategy(User.authenticate()));


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error =  req.flash('error');
    next();
})

app.get("/",(req,res)=>{
    res.render("home");
});

//Routes
app.use(eventRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(registrationRoutes);
app.use(societyRoutes);
app.use(profileRoutes);
app.use(eventApi);
app.use(contactRoute)
// app.use(analyticsRoutes)

// seedDB(); //run only once

const PORT = 8080;
app.listen(PORT,()=>{
    console.log(`Server running at port : ${PORT}`)
})