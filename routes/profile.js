const express = require("express");
const User = require("../models/User");
const router = express.Router();
const {isLoggedIn} = require('../middleware')

// Get the profile page
router.get("/profile", isLoggedIn,async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist').populate('registeredEvents');
        res.render("profile/show",{user});
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Edit profile form
router.get('/profile/edit', isLoggedIn, async (req, res) => {
    try {
        res.render('profile/edit', { user:req.user });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Update profile
router.patch('/profile/update', isLoggedIn, async (req, res) => {
    try {
        const { name, email, rollno, year, branch, contactno } = req.body;
        await User.findByIdAndUpdate(req.user.id, { name, email, rollno, year, branch, contactno });

        req.flash('success', 'Profile Edited Successfully');
        res.redirect(`/profile`);
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Delete profile
router.delete('/profile', isLoggedIn, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);

        req.logout((err) => {
            if (err) {
                return res.render('error', { err: err.message });
            }
            req.flash('success', 'User Deleted Successfully');
            res.redirect('/');
        });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

module.exports = router;