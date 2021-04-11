const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    ground: {
        type: Schema.Types.ObjectId,
        ref: 'TennisCourt'
    },
    unitCourt: String,
    date: String,
    weekDay: String,
    startTime: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Booking', BookingSchema);