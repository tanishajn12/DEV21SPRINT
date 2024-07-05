const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); 
const User = require('../models/User')
const { getEventAnalytics } = require('../public/js/analytics'); // Assuming correct path to analytics.js

router.get('/events/:id/analytics', async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            req.flash('error', 'Event not found');
            return res.redirect('/events');
        }

        const analytics = await getEventAnalytics(eventId);

        res.render('analytics', {
            eventName: event.name,
            analytics
        });
    } catch (e) {
        console.error(e);
        req.flash('error', 'Something went wrong');
        res.redirect('/events');
    }
});

module.exports = router;
