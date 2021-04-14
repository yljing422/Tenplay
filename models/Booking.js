const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    ground: {
        type: Schema.Types.ObjectId,
        ref: 'TennisCourt'
    },
    unitCourt: String,
    month: Number,
    day: Number,
    weekDay: Number,
    time: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Booking', BookingSchema);