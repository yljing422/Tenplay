// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');
// import TennisCourt booking schema
const Booking = require('../models/booking');
const User = require('../models/user');

module.exports.createBooking = async (req, res) => {
    const court = await TennisCourt.findById(req.params.id);
    const user = await User.findById(req.user._id);
    const booking = new Booking(req.body.booking);
    booking.user = req.user._id;
    await booking.save();
    court.bookings.push(booking);
    user.bookings.push(booking);
    await court.save();
    await user.save();

    req.flash('success', 'Booking successful!');
    res.redirect(`/tenniscourts/${court._id}`);
}


module.exports.deleteBooking = async(req, res) => {
    const { id, bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    userId = booking.user._id
    await TennisCourt.findByIdAndUpdate(id, { $pull: { bookings: bookingId } });
    await User.findByIdAndUpdate(userId, { $pull: { bookings: bookingId } });
    await Booking.findByIdAndDelete(bookingId);
    req.flash('success', 'Successfully deleted the booking');
    res.redirect(`/user/${userId}`);
}