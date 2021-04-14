// use express(npm i express)
const express = require('express');
// use router template
const router = express.Router({ mergeParams: true });
// import from middleware.js
const { isLoggedIn } = require('../middleware');
// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');
// import TennisCourt Booking schema
const Booking = require('../models/booking');
// import booking controller
const booking = require('../controllers/booking');
// replace try catch in async function
const catchAsync = require('../utils/catchAsync');
// customized format of error dispaly
const ExpressError = require('../utils/ExpressError');

router.post('/', isLoggedIn, catchAsync(booking.createBooking));

module.exports = router;