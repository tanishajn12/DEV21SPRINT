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
        let { name, img, type, description, email, instagram, linkedin } = req.body; 
        await Society.create({ name, img, type, description, email, instagram, linkedin, societyAdmin: req.user._id });
        req.flash('success', 'Society Added Successfully');
        res.redirect('/societies');
    } catch (e) {
        res.render('error', { err: e.message });
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
        let { name, img, type, description, email, instagram, linkedin } = req.body;
        const society = await Society.findByIdAndUpdate(id, { name, img, type, description, email, instagram, linkedin });

        //Update associated events with the new society details
        await Event.updateMany({ society: id }, { society: society._id });


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