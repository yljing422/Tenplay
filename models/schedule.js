const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
    ground: {
        type: Schema.Types.ObjectId,
        ref: 'TennisCourt'
    },
    unitCourt: String,
    booking: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ]
});

module.exports = mongoose.model('Schedule', ScheduleSchema);