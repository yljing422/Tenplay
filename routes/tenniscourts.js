// use express(npm i express)
const express = require('express');
// use router template
const router = express.Router();
// import from controller
const tenniscourts = require('../controllers/tenniscourts');
// replace try catch in async function
const catchAsync = require('../utils/catchAsync');
// import from middleware.js
const { isLoggedIn, isAdmin, validateTennisCourt } = require('../middleware');

// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');


router.route('/')
    // get all courts
    .get(catchAsync(tenniscourts.index))
    //post new tennis court, hit from new form
    .post(isLoggedIn, validateTennisCourt, catchAsync(tenniscourts.createTennisCourt));

// add new
router.get('/new', isLoggedIn, tenniscourts.renderNewForm);

router.get('/search', catchAsync(tenniscourts.search));

router.route('/:id')
    // get particular court
    .get(catchAsync(tenniscourts.showTennisCourt))
    // update the court
    .put(isLoggedIn, isAdmin, validateTennisCourt, catchAsync(tenniscourts.updateTennisCourt))
    // delete the court
    .delete(isLoggedIn, isAdmin, catchAsync(tenniscourts.deleteTennisCourt));

// go to edit page
router.get('/:id/edit', isLoggedIn, isAdmin, catchAsync(tenniscourts.renderEditForm));

module.exports = router;