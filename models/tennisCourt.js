// Use mongoose
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// allow to add properties into schema
const opts = { toJSON: { virtuals: true } };

const TennisCourtSchema = new Schema({
    name: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    courtNum: Number,
    image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    latitude: Number,
    longitude: Number,
    startTime: String,
    endTime: String,
    light: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    bookings: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Booking'
        }
    ]
}, opts);

// add the properties' field
TennisCourtSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/tenniscourts/${this._id}">${this.name}</a><strong>
    <p>${this.street}, ${this.city}, ${this.state} ${this.zipcode}</p>`
});

// middleware for delete relative reviews when delete the certain tennis court, findByIdAndDelete(id) will triggers findOneAndDelete() middleware
TennisCourtSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('TennisCourt', TennisCourtSchema);