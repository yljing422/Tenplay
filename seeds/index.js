// use mongoose
const mongoose = require('mongoose');
// use seeds data
const courts = require('./courts');
// use TennisCourtSchema
const TennisCourt = require('../models/tennisCourt')

//use mongoose connect MongoDB
mongoose.connect('mongodb://localhost:27017/ten-play', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

//use mongoose connect MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

// create TennisCourt object and save to MongoDB
const seedDB = async () => {
    await TennisCourt.deleteMany({});
    for (let i = 0; i < courts.length; i++) {
        // const geoData = await geocoder.forwardGeocode({
        //     query: `${courts[i].street}, ${courts[i].city}, ${courts[i].state}, ${courts[i].zipcode}`,
        //     limit: 1
        // }).send()
        const court = new TennisCourt({
            author: '604e7a0a0f4801231ce41719',
            name: `${courts[i].name} Tennis Courts`,
            street: `${courts[i].street}`,
            city: `${courts[i].city}`,
            state: `${courts[i].state}`,
            zipcode: `${courts[i].zipcode}`,
            geometry: {
                type: "Point",
                coordinates: [
                    courts[i].longitude,
                    courts[i].latitude
                ]
            },
            // geometry: geoData.body.features[0].geometry,
            courtNum: `${courts[i].courtNum}`,
            image: `${courts[i].image}`,
            startTime: `${courts[i].startTime}`,
            endTime: `${courts[i].endTime}`,
            light: `${courts[i].light}`,
            latitude: `${courts[i].latitude}`,
            longitude: `${courts[i].longitude}`
        });
        await court.save();
    }
};

// exit mongoose connection
seedDB().then(() => {
    mongoose.connection.close()
});