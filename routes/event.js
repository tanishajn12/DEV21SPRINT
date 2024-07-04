const express =  require("express");
const Event = require('../models/Event');
const Society = require('../models/Society');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {validateEvent, isLoggedIn, isAdmin, isEventAuthor}=require('../middleware');

const router = express.Router(); //same work as app

router.get("/events", async (req,res)=> {
    try{
        let events = await Event.find({}).populate('society');
        res.render("events/index",{events, currentUser: req.user})
    }

    catch(e) {
        res.render('error', {err : e.message})
    }
});

//new form
// user must be logged in to add an product
router.get("/event/new", isLoggedIn, isAdmin, async (req,res)=>{
    try{
        // Fetch the list of societies from the database
        const societies = await Society.find({}, 'name');
        res.render('events/new',{societies}); 
    }

    catch(e) {
        res.render('error', {err : e.message})
    }
   
})

//adding 
//validate product -> first check and then add
router.post('/events', isLoggedIn, isAdmin, validateEvent, async (req, res) => {
    try {
        let { name, img, date, time, society, venue, type, desc, registerLink} = req.body; // Destructure the event fields from the request body
        const event = await Event.create({
            name,
            img,
            date: new Date(date), // Ensure date is properly formatted
            time,
            society,
            venue,
            type,
            desc,
            registerLink,
            author:req.user._id
        });
        // Update Society's events array
        await Society.findByIdAndUpdate(society, { $push: { events: event._id } });

        req.flash('success', 'Event Added Successfully');
        res.redirect('/events'); // Redirect to the events page or appropriate route
    } catch (e) {
        // req.flash('error', 'Error adding event');
        res.render('error', { err: e.message }); // Render error page with the error message
    }
});

//show a particular event
router.get('/events/:id', isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        let foundEvent = await Event.findById(id)
                                    .populate('society')
                                    .populate('reviews'); // Assuming 'society' is the field referencing societies
        res.render('events/show', { foundEvent, success: req.flash('msg') });
    } catch (e) {
        res.render('error', { err: e.message });
    }
});


// Admin view for event registrations
router.get('/events/:id/registrations', isLoggedIn,isEventAuthor, async (req, res) => {
    const event = await Event.findById(req.params.id).populate({
        path: 'registrations',
        populate: { path: 'user' }
    });
    res.render('events/registrations', { event });
});

router.get('/events/:id/edit',  async (req,res)=> {
    try{
        let {id} = req.params;
        let foundEvent = await Event.findById(id);
        let societies = await Society.find({},'name') ; //fetch all societies
        // console.log(foundEvent);
        res.render('events/edit',{foundEvent, societies})
    }

    catch(e) {
        res.render('error', {err : e.message})
    }
})

//actually changing the product
router.patch('/events/:id', isLoggedIn, validateEvent, isAdmin, isEventAuthor, async (req, res) => {
    try {
        let { id } = req.params;
        let { name, img, date, time, society, venue, type, desc, registerLink } = req.body;

        // console.log('Received data:', req.body);

        // Get the current event
        const event = await Event.findById(id);
        
        // console.log('Current event:', event);

       // Convert society to ObjectId if it's not already
       const newSocietyId = new mongoose.Types.ObjectId(society);
       const currentSocietyId = event.society;

        // console.log('Current event society:', currentSocietyId );
        // console.log('New society:', newSocietyId);

        // If the society has changed
        if (currentSocietyId.toString() !== newSocietyId.toString()) {
            // console.log('Society has changed');

            // Update Society's events array for the new society
            await Society.findByIdAndUpdate(newSocietyId, { $push: { events: id } });
            // console.log('Event added to new society:', newSocietyId);

            // Remove event id from the previous society's events array
            await Society.findByIdAndUpdate(currentSocietyId, { $pull: { events: id } });
            // console.log('Event removed from previous society:', currentSocietyId);
        }

        // Update the event with the new details
        await Event.findByIdAndUpdate(id, { name, img, date, time, society: newSocietyId, venue, type, desc, registerLink });

        // console.log('Event updated');

        req.flash('success', 'Event Edited Successfully');
        res.redirect(`/events/${id}`);
    } 
    
    catch (e) {
        console.error('Error editing event:', e);
        res.render('error', { err: e.message });
    }
});


router.delete('/events/:id', isLoggedIn, isAdmin, isEventAuthor, async (req, res) => {
    try {
        let { id } = req.params;
        let foundEvent = await Event.findById(id);
        
        //deleting reviews before deleting events
        for(let ids of foundEvent.reviews) {
            await Review.findByIdAndDelete(ids);
        }

        // Update Society's events array
        await Society.findByIdAndUpdate(foundEvent.society, { $pull: { events: id } });

        await Event.findByIdAndDelete(id);
        req.flash('success', 'Event Deleted Successfully');
        res.redirect('/events');
    } 
    
    catch (e) {
        res.render('error', { err: e.message });
    }
});

module.exports = router;
