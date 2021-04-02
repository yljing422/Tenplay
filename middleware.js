// use tool of Joi do the back-end validation
const { tenniscourtSchema, reviewSchema } = require('./schemas.js');
// customized format of error dispaly
const ExpressError = require('./utils/ExpressError');
// import TennisCourt mongoose schema
const TennisCourt = require('./models/tennisCourt');
const Review = require('./models/review');

// check is the user logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// use joi schema validation to check the error
module.exports.validateTennisCourt = (req, res, next) => {
    console.log(req.body);
    const { error } = tenniscourtSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// check is it admin that can manipulate the add update remove operation
module.exports.isAdmin = async (req, res, next) => {
    const { id } = req.params;
    const court = await TennisCourt.findById(id);
    if (!court.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/tenniscourts/${id}`);
    }
    next();
}

// check is it admin that can manipulate the add update remove operation
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/tenniscourts/${id}`);
    }
    next();
}

// use joi schema validation to check the error
module.exports.validateReview = (req, res, next) => {
    console.log(req.body);
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
