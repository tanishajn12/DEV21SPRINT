const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    // username - PLM(passport-local-mongoose)
    // password - PLM(passport-local-mongoose)
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    rollno: {
        type: Number,
        required: true
    },

    contactno: {
        type: String ,
        required: true
    },
    role: {
        type: String,
        default: 'student'
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    ],
});

userSchema.plugin(passportLocalMongoose); // Apply passport-local-mongoose plugin

const User = mongoose.model('User', userSchema);
module.exports = User;
