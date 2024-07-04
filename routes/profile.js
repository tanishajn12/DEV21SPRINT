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
router.post('/profile/update', isLoggedIn, async (req, res) => {
    try {
        const { name, email, rollno, year, branch, contactno } = req.body;

        // Fetch the user from the database
        let user = await User.findById(req.user.id);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/profile');
        }

        // Update user object with new values
        user.name = name;
        user.email = email;
        user.rollno = rollno;
        user.year = year;
        user.branch = branch;
        user.contactno = contactno;

        // Save the updated user object
        await user.save();

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