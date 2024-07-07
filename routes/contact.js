const express = require('express');
const { isLoggedIn } = require('../middleware'); // Assuming you have isLoggedIn middleware defined
const router = express.Router();

router.get('/contact', isLoggedIn, async (req, res) => {
    try {
        res.render('contact'); 
    } catch (e) {
        res.render('error', { err: e.message });
    }
});

module.exports = router;
