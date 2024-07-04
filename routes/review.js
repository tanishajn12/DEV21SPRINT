const express = require("express")
const router = express.Router();
const Event = require("../models/Event");
const Review = require("../models/Review");
const {validateReview, isLoggedIn} = require('../middleware')

router.post('/events/:id/review', isLoggedIn, validateReview, async (req,res)=>{
    try{
        let {rating, comment} = req.body;
        let {id} = req.params;

        const event = await Event.findById(id);

        //new review
        const review = new Review({rating, comment});
        
        event.reviews.push(review);
        //save method is from mongo db hence awaut method
        await event.save();
        await review.save(); 


        //adding flash message
        req.flash('success' , 'Review added successfully');
        res.redirect(`/events/${id}`);
    }

    catch(e) {
        res.render('error',{err: e.message})
    }
})

module.exports= router;