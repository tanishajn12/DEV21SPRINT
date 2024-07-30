const express =  require("express");
const User = require('../models/User');
const Society = require('../models/Society');
const Team = require('../models/Team');
const Recruitment = require('../models/Recruitment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const {isLoggedIn, isAdmin, isSocietyAdmin}=require('../middleware');
const router = express.Router(); 

// router.get('/recruitments/:id/:teamid/apply', isLoggedIn, async (req, res) => {
//     try {
//         const { id, teamid } = req.params;

//         // Fetch society and team from the database
//         const society = await Society.findById(id);
//         // console.log('Society:', society);
//         const team = await Team.findById(teamid);
//         const user = req.user;

//         if (!society || !team) {
//             throw new Error("Society or team not found");
//         }

//         // Pass the society, team, and user to the EJS template
//         res.render('teams/apply', { society, team, user });
//     } 
    
//     catch (e) {
//         res.status(500).render('error', { err: e.message });
//     }
// });


// router.post('/recruitments/:id/:teamid/apply', isLoggedIn, async (req, res) => {
//     try {
//         const { id, teamid } = req.params; 
//         const { workLink } = req.body;

//         if (!workLink) {
//             throw new Error("Work link is required.");
//         }

//         const existingApplication = await Recruitment.findOne({ 
//             society: id, 
//             user: req.user._id 
//         });

//         if (existingApplication) {
//             req.flash('error', 'You have already applied to a team in this society.');
//             return res.redirect(`/societies/${id}/teams`);
//         }


//         const recruitment = new Recruitment({
//             team: teamid,
//             society: id,
//             user: req.user._id,
//             workLink: workLink,
//             status: 'Applied'
//         });

//         await recruitment.save();

//         const team = await Team.findById(teamid);

//         if (!team) {
//             throw new Error("Team not found.");
//         }
//         team.recruitments.push(recruitment._id);
//         team.appliedUsers.push(req.user._id);
//         await team.save();

//         // Redirect to a relevant page; for example, back to the team or society page
//         res.redirect(`/recruitments/${id}`); // Adjust this route as necessary
//     } catch (e) {
//         res.status(500).render('error', { err: e.message });
//     }
// });

// Route to show the application form for a specific team under a society
router.get('/recruitments/:id/:teamid/apply', isLoggedIn, async (req, res) => {
    try {
        const { id, teamid } = req.params;
        const society = await Society.findById(id);
        const team = await Team.findById(teamid);
        const user = req.user;

        if (!society || !team) {
            throw new Error("Society or team not found");
        }

        // Check if the society is accepting applications
        if (!society.recruitmentOpen) {
            req.flash('error', 'Applications are currently closed.');
            return res.redirect(`/societies/${id}`);
        }

        // Check if the user has already applied to a team in this society
        const existingApplication = await Recruitment.findOne({ society: id, user: user._id });
        if (existingApplication) {
            req.flash('error', 'You have already applied to a team in this society.');
            return res.redirect(`/societies/${id}`);
        }

        res.render('teams/apply', { society, team, user });
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

// Route to handle the application form submission
router.post('/recruitments/:id/:teamid/apply', isLoggedIn, async (req, res) => {
    try {
        const { id, teamid } = req.params;
        const { workLink } = req.body;

        if (!workLink) {
            req.flash('error', 'Work link is required.');
            return res.redirect(`/recruitments/${id}/${teamid}/apply`);
        }

        // Check if the user has already applied to a team in this society
        const existingApplication = await Recruitment.findOne({ society: id, user: req.user._id });
        if (existingApplication) {
            req.flash('error', 'You have already applied to a team in this society.');
            return res.redirect(`/societies/${id}/teams`);
        }

        const recruitment = new Recruitment({
            team: teamid,
            society: id,
            user: req.user._id,
            workLink: workLink,
            status: 'Applied'
        });

        await recruitment.save();

        const team = await Team.findById(teamid);
        if (!team) {
            throw new Error("Team not found.");
        }

        team.recruitments.push(recruitment._id);
        team.appliedUsers.push(req.user._id);
        await team.save();

        req.flash('success', 'Your application has been submitted.');
        res.redirect(`/societies/${id}/teams`);
    } catch (e) {
        res.status(500).render('error', { err: e.message });
    }
});

// Get registrations for a specific team under a society
router.get('/recruitments/:id/:teamid/registrations', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        const { id, teamid } = req.params;

        // Fetch the society and team data
        const society = await Society.findById(id);
        const team = await Team.findById(teamid).populate({
            path: 'recruitments',
            populate: { path: 'user' }
        });

        if (!society) {
            throw new Error("Society not found");
        }

        if (!team) {
            throw new Error("Team not found");
        }

        // Render the registrations view with both society and team data
        res.render('teams/registrations', { society, team });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(500).render('error', { err: e.message });
    }
});

module.exports = router;