const express =  require("express");
const Society = require('../models/Society');
const User = require('../models/User');
const Team = require('../models/Team');
const Recruitment = require('../models/Recruitment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Route /recruitments: Fetches and displays all societies with an "Apply Now" button.
// Route /recruitments/:id: Fetches and displays teams under a particular society.
// Route /recruitments/:id/new: Renders a form to add a new team under a specific society.
// Route /recruitments/:id (POST): Handles form submission to create a new team under a specific society.
// Route /recruitments/:id/:teamid/registrations: Fetches and displays registrations for a specific team.
// Route /recruitments/:id/:teamid/edit: Renders a form to edit a specific team's details.
// Route /recruitments/:id/:teamid (PATCH): Handles form submission to update a specific team's details.
// Route /recruitments/:id/:teamid (DELETE): Handles deletion of a specific team and removes it from the society's teams array.

const {isLoggedIn, isAdmin, isSocietyAdmin}=require('../middleware');
const router = express.Router(); 

// Display all societies 
router.get('/recruitments', isLoggedIn, async (req, res) => {
    try {
        const societies = await Society.find({}).populate('teams');
        res.render('teams/index', { societies, currentUser: req.user });
    } catch (e) {
        console.error(e);
        res.render('error', { err: e.message });
    }
});

// Display the teams under a particular society
router.get('/recruitments/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const foundSociety = await Society.findById(id).populate('teams');

        // Check if the user has already applied to any team in the society
        const currentUserHasApplied = await Recruitment.exists({ society: id, user: req.user._id });

        res.render('teams/show', { foundSociety, currentUserHasApplied, success: req.flash('msg') });
    } catch (e) {
        console.error(e);
        res.render('error', { err: e.message });
    }
});


// Show form to add a new team under a specific society
router.get("/recruitments/:id/new", isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        let foundSociety = await Society.findById(id);
        res.render('teams/new', { foundSociety });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Add a new team under a specific society
router.post('/recruitments/:id', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc, registerLink, lastdate } = req.body;

        // Create a new team instance with the form data
        const newTeam = new Team({
            name,
            desc,
            registerLink,
            lastdate,
            society: id
        });

        // Save the new team to the database
        await newTeam.save();

        // Add the newly created team to the society's teams array
        const society = await Society.findById(id);
        society.teams.push(newTeam._id);
        await society.save();

        // Set a success message and redirect back to the society's recruitment page
        req.flash('success', 'Team added successfully');
        res.redirect(`/recruitments/${id}`);
    } 
    
    catch (e) {
        console.error(e);
        req.flash('error', 'Failed to add the team. Please try again.');
        res.redirect('back');
    }
});


// Show form to edit a specific team's details
router.get('/recruitments/:id/:teamid/edit', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id, teamid } = req.params;
        const team = await Team.findById(teamid);
        if (!team) {
            req.flash('error', 'Team not found');
            return res.redirect(`/recruitments/${id}`);
        }
        res.render('teams/edit', { team });
    } 
    
    catch (e) {
        console.error(e);
        res.render('error', { err: e.message });
    }
});


// Edit a specific team's details
router.patch('/recruitments/:id/:teamid', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id, teamid } = req.params;
        const { name, desc, registerLink, lastdate } = req.body;

        // Update the team's details
        await Team.findByIdAndUpdate(teamid, {
            name,
            desc,
            registerLink,
            lastdate
        });

        req.flash('success', 'Team edited successfully');
        res.redirect(`/recruitments/${id}`);
    } catch (e) {
        console.error(e);
        req.flash('error', 'Failed to edit the team. Please try again.');
        res.redirect('back');
    }
});

// Assuming you have a middleware to check if the user is logged in
router.post('/recruitments/:id/toggleRecruitment', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const currentUser = req.user; 

    try {
        const society = await Society.findById(id);

        if (!society) {
            return res.status(404).send('Society not found');
        }

        // Check if the current user is the admin of the society
        if (society.societyAdmin.toString() !== currentUser._id.toString()) {
            return res.status(403).send('Permission denied');
        }

        // Update recruitment status
        society.recruitmentOpen = req.body.recruitmentOpen === 'on';
        await society.save();

        res.send('Recruitment status updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating recruitment status');
    }
});


// Delete a specific team
router.delete('/recruitments/:id/:teamid', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id, teamid } = req.params;

        // Remove the team from the society's teams array
        await Society.findByIdAndUpdate(id, { $pull: { teams: teamid } });

        // Delete the team
        await Team.findByIdAndDelete(teamid);

        req.flash('success', 'Team Deleted Successfully');
        res.redirect(`/recruitments/${id}`);
    } 
    
    catch (e) {
        console.error(e);
        req.flash('error', 'Failed to delete the team. Please try again.');
        res.redirect(`/recruitments/${id}`);
    }
});

module.exports = router;