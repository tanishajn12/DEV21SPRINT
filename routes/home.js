


const express =  require("express");
const Event = require('../models/Event');
const Society = require('../models/Society');
const router = express.Router();

// Get all societies
router.get("/", async (req, res) => {
    try {
        let societies = await Society.find({});
        let events = await Event.find({});
        res.render("home", { societies , events});
    } 
    
    catch (e) {
        res.render('error', { err: e.message });
    }
});
module.exports = router;
