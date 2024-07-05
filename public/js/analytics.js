const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');

async function getEventAnalytics(eventId) {
    const event = await Event.findById(eventId).populate('registeredUsers');

    if (!event) {
        throw new Error('Event not found');
    }

    const analytics = await User.aggregate([
        {
            $match: {
                _id: { $in: event.registeredUsers }
            }
        },
        {
            $group: {
                _id: { branch: "$branch", year: "$year" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.branch': 1,
                '_id.year': 1
            }
        }
    ]);

    return analytics;
}

module.exports = { getEventAnalytics };
