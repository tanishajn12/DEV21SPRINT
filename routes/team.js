const express =  require("express");
const Society = require('../models/Society');
const User = require('../models/User');
const Team = require('../models/Team');
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

const {isLoggedIn, isAdmin}=require('../middleware');
const router = express.Router(); 

// Display all societies 
router.get("/recruitments", async (req, res) => {
    try {
        let societies = await Society.find({});
        res.render("teams/index", { societies });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Display the teams under a particular society
router.get('/recruitments/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        let foundSociety = await Society.findById(id).populate('teams');
        res.render('teams/show', { foundSociety, success: req.flash('msg') });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Show form to add a new team under a specific society
router.get("/recruitments/:id/new", isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        let foundSociety = await Society.findById(id);
        res.render('teams/new', { foundSociety });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Add a new team under a specific society
router.post('/recruitments/:id', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, type } = req.body;
        const newTeam = new Team({ name, description, type, society: id });

        // Save the new team
        await newTeam.save();

        // Add the team to the society's teams array
        const society = await Society.findById(id);
        society.teams.push(newTeam._id);
        await society.save();

        req.flash('success', 'Team Added Successfully');
        res.redirect(`/recruitments/${id}`);
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Get registrations for a specific team under a society
router.get('/recruitments/:id/:teamid/registrations', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { teamid } = req.params;
        const team = await Team.findById(teamid).populate({
            path: 'recruitments',
            populate: { path: 'user' }
        });
        res.render('teams/registrations', { team });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Show form to edit a specific team's details
router.get('/recruitments/:id/:teamid/edit', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { teamid } = req.params;
        const team = await Team.findById(teamid);
        res.render('teams/edit', { team });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Edit a specific team's details
router.patch('/recruitments/:id/:teamid', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { teamid } = req.params;
        const { name, description, type } = req.body;

        // Update the team's details
        await Team.findByIdAndUpdate(teamid, { name, description, type });

        req.flash('success', 'Team Edited Successfully');
        res.redirect(`/recruitments/${req.params.id}`);
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Delete a specific team
router.delete('/recruitments/:id/:teamid', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id, teamid } = req.params;

        // Remove the team from the society's teams array
        await Society.findByIdAndUpdate(id, { $pull: { teams: teamid } });

        // Delete the team
        await Team.findByIdAndDelete(teamid);

        req.flash('success', 'Team Deleted Successfully');
        res.redirect(`/recruitments/${id}`);
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

module.exports = router;