// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');
// import TennisCourt review schema
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const court = await TennisCourt.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    court.reviews.push(review);
    await review.save();
    await court.save();
    req.flash('success', 'Create new review!');
    res.redirect(`/tenniscourts/${court._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await TennisCourt.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/tenniscourts/${id}`);
}