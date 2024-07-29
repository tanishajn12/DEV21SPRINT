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
    }
    
});


let Recruitment = mongoose.model('Recruitment',recruitmentSchema);
module.exports = Recruitment;


