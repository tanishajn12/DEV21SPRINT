const mongoose = require("mongoose");

// Define the event schema
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    img: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String, 
        required: true
    },
    society: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society', 
        required: true
    },
    venue: {
        type: String,
        trim: true,
        required: true
    },
    type: {
        type: String,
        trim: true,
        required: true
    },
    desc: {
        type: String,
        trim: true
    },
    registerLink: {
        type: String,
        trim: true
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    registrations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Registration'
        }
    ],
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;




