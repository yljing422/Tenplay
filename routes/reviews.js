// use express(npm i express)
const express = require('express');
// use router template
const router = express.Router({ mergeParams: true });
// import from middleware.js
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');
// import TennisCourt review schema
const Review = require('../models/review');
// import review controller
const reviews = require('../controllers/reviews');
// replace try catch in async function
const catchAsync = require('../utils/catchAsync');
// customized format of error dispaly
const ExpressError = require('../utils/ExpressError');

// create a review, validate by back-end, save review and then save to the certain court
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete the certain review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;