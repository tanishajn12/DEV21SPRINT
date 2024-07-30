const express =  require("express");
const Event = require('../models/Event');
const Society = require('../models/Society');
const {validateSociety, isLoggedIn, isAdmin, isSocietyAdmin}=require('../middleware');
const router = express.Router(); //same work as app

// Get all societies
router.get("/societies", async (req, res) => {
    try {
        let societies = await Society.find({});
        res.render("societies/index", { societies });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// New society form
router.get("/society/new", isLoggedIn, isAdmin, (req, res) => {
    try {
        res.render('societies/new');
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Add new society
router.post('/societies', isLoggedIn, isAdmin, validateSociety, async (req, res) => {
    try {
        const { name, img, type, description, email, instagram, linkedin, recruitmentOpen } = req.body; 
        console.log("Creating society with data:", req.body);

        // Handle recruitmentOpen checkbox, default to false if not checked
        const isRecruitmentOpen = recruitmentOpen === 'on';

        const newSociety = new Society({
            name,
            img,
            type,
            description,
            email,
            instagram,
            linkedin,
            societyAdmin: req.user._id,
            recruitmentOpen: isRecruitmentOpen
        });

        await newSociety.save();
        req.flash('success', 'Society Added Successfully');
        res.redirect('/societies');
    } catch (e) {
        console.error(e);
        res.render('error', { err: e.message });
    }
});


// Toggle recruitment status
router.post('/societies/:id/toggleRecruitment', isLoggedIn, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { recruitmentOpen } = req.body; // This will be a string 'on' or undefined

        // Convert to boolean
        const isRecruitmentOpen = recruitmentOpen === 'on';

        // Find the society and update the recruitmentOpen status
        const society = await Society.findByIdAndUpdate(id, { recruitmentOpen: isRecruitmentOpen }, { new: true });

        if (!society) {
            return res.status(404).send('Society not found');
        }

        res.redirect(`/societies/${id}`);
    } catch (e) {
        console.error(e);
        res.status(500).send('Error updating recruitment status');
    }
});


// Show particular society
router.get('/societies/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        let foundSociety = await Society.findById(id).populate('events');
        res.render('societies/show', { foundSociety, success: req.flash('msg') });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Edit society form
router.get('/societies/:id/edit', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        let { id } = req.params;
        let foundSociety = await Society.findById(id);
        res.render('societies/edit', { foundSociety });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

// Update society
router.patch('/societies/:id', isLoggedIn, isAdmin, isSocietyAdmin, validateSociety, async (req, res) => {
    try {
        let { id } = req.params;
        let { name, img, type, description, email, instagram, linkedin, recruitmentOpen } = req.body;

        // Handle recruitmentOpen checkbox, default to false if not checked
        const isRecruitmentOpen = recruitmentOpen === 'on';

        // Update the society
        const updatedSociety = await Society.findByIdAndUpdate(id, { 
            name, 
            img, 
            type, 
            description, 
            email, 
            instagram, 
            linkedin, 
            recruitmentOpen: isRecruitmentOpen 
        }, { new: true, runValidators: true });

        // Update associated events with the new society details
        await Event.updateMany({ society: id }, { society: updatedSociety._id });

        req.flash('success', 'Society Edited Successfully');
        res.redirect(`/societies/${id}`);
    } catch (e) {
        res.render('error', { err: e.message });
    }
});


// Delete society
router.delete('/societies/:id', isLoggedIn, isAdmin, isSocietyAdmin, async (req, res) => {
    try {
        let { id } = req.params;
        
        // Update associated events - set their society field to null
        await Event.updateMany({ society: id }, { society: null });
        await Society.findByIdAndDelete(id);

        req.flash('success', 'Society Deleted Successfully');
        res.redirect('/societies');
    } 
    
    catch (e) {
        res.render('error', { err: e.message });
    }
});

module.exports = router;