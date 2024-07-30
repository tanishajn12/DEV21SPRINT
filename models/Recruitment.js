const mongoose = require('mongoose');

let recruitmentSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    society : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society'
    },
    team : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    workLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Accepted', 'Rejected'],
        default: 'Applied'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
    
});


let Recruitment = mongoose.model('Recruitment',recruitmentSchema);
module.exports = Recruitment;


