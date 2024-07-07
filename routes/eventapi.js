const express = require('express');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User'); 
const Event = require('../models/Event');
const router = express.Router();

router.post('/events/:id/like', isLoggedIn, async (req, res) => {
    try {
        let { id } = req.params; // event id
        let userId = req.user._id; // user id
        let user =  await User.findById(userId);
        let event = await Event.findById(id);


        let isLiked = user.wishlist.includes(id);

        if (isLiked) {
            // Remove event from user's wishlist
            await User.findByIdAndUpdate(userId, { $pull: { wishlist: id } });
            // Remove user from event's likedUsers
            await Event.findByIdAndUpdate(id, { $pull: { likedUsers: userId } });
        } else {
            // Add event to user's wishlist
            await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: id } });
            // Add user to event's likedUsers
            await Event.findByIdAndUpdate(id, { $addToSet: { likedUsers: userId } });
        }

        res.json({ success: true, liked: !isLiked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
