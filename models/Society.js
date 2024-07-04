// models/Society.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Custom validator function to check if a string is a valid URL
const validateURL = function(url) {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urlRegex.test(url);
};

const societySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        enum: ['Technical', 'Cultural', 'Social'],
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    description: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    instagram: {
        type: String,
        validate: [validateURL, 'Please enter a valid URL']
    },
    linkedin: {
        type: String,
        validate: [validateURL, 'Please enter a valid URL']
    },
    societyAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

module.exports = mongoose.model('Society', societySchema);
