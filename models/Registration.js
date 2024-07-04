const mongoose = require('mongoose');

let registrationSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    event : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    registeredAt: { type: Date, default: Date.now }
});


let Registration = mongoose.model('Registration',registrationSchema);
module.exports = Registration;



