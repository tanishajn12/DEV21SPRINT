const express = require("express")
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User")
const Registration = require("../models/Registration");
const {isLoggedIn} = require('../middleware')

router.post('/events/:id/register', isLoggedIn, async (req,res)=>{
    try{
        let {id} = req.params;

        const event = await Event.findById(id).populate('registrations');
        
        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        // Check if the user is already registered
        const existingRegistration = await Registration.findOne({ user: req.user._id, event: event._id });
        if (existingRegistration) {
            req.flash('error', 'You are already registered for this event');
            return res.redirect(`/events/${id}`);
        }

        // Add the user to the event's registrations
        event.registeredUsers.push(req.user._id);

        // Add the event to the user's registeredEvents
        const user= await User.findById(req.user._id);
        user.registeredEvents.push(event._id);


        //new registratioon
        const registration = new Registration({
            user : req.user._id,
            event : event._id
        });
        event.registrations.push(registration)
        
        //save method is from mongo db hence await method
        await event.save();
        await registration.save(); 
        await user.save();


        //adding flash message
        // console.log("registered successfully");
        req.flash('success' , 'Registered successfully');
        res.redirect(`/events/${id}`);
    }

    catch(e) {
        req.flash('error', 'Something went wrong');
        res.redirect('/events');
    }
})

module.exports= router;