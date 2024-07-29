const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    society: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society', 
        required: true
    },
    name: {
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
    lastdate: {
        type: Date,
        required: true
    },
    recruitments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruitment'
        }
    ],
    appliedUsers : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

// Create the Event model
const Team = mongoose.model('Team', teamSchema);
module.exports = Team;




