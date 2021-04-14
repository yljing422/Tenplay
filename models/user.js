const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// use passport for the features of register, login and logout
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Booking'
        }
    ],
});

// use passport-local-mongoose to add the password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);