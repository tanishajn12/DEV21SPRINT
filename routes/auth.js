const express = require("express");
const User = require("../models/User");
const passport=require('passport');
const router = express.Router();


router.get('/register',(req,res)=>{
    res.render('auth/signup');
})


router.post('/register', async (req,res)=>{
    let {username , password, name, email, rollno,year, branch, contactno, role} = req.body;
    let user = new User({username , password, name, email, rollno, year, branch, contactno, role});
    let newUser = await User.register(user, password);
    // res.send(newUser);
    res.redirect('/events');
    
})


router.get('/login', (req,res)=>{
    res.render('auth/login');
})

router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureMessage: true 
    }),
    function(req, res) {
        //once i get logged in it already has an object req
        // console.log( req.user, "User");
        req.flash('success',`Welcome Back ${req.user.username}`);
        res.redirect('/events');
    }
);


router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.flash('success', 'Logged out successfully');
        res.redirect('/login');
    });
})

module.exports= router;