// import TennisCourt mongoose schema
const TennisCourt = require('../models/tennisCourt');
const Booking = require('../models/booking');
// import mapbaox (npm install @mapbpx/mapbpx-sdk)
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index = async (req, res) => {
    const tennisCourts = await TennisCourt.find({});
    res.render('tennisCourts/index', { tennisCourts })
}

module.exports.renderNewForm = (req, res) => {
    if (!req.user._id.equals('604e7a0a0f4801231ce41719')) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/tenniscourts');
    }
    res.render('tennisCourts/new');
}

module.exports.createTennisCourt = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode ({
        query: req.body.tenniscourt.city,
        limit: 1
    }).send()
    const court = new TennisCourt(req.body.tenniscourt);
    console.log(req.body.tenniscourt)
    court.geometry = geoData.body.features[0].geometry;
    court.author = req.user._id;
    await court.save();
    req.flash('success', 'Successfully made a new tennis court!');
    res.redirect(`/tenniscourts/${court._id}`);
}

module.exports.showTennisCourt = async (req, res) => {
    const court = await TennisCourt.findById(req.params.id).populate('bookings').populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    const d = new Date();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const time = d.getHours();
    // var filtered = array.filter(function(value, index, array){ 
    //     return value > 5;
    // });
    const array = court.bookings;
    let bookings = []
    for (let ele of array) {
        if (ele.month > month || (ele.month === month && ele.day >= day)) {
            bookings.push(ele);
        }
    }
    court.bookings = bookings;
    if (!court) {
        req.flash('error', 'Cannot find that tennis court!');
        return res.redirect('/tenniscourts');
    }
    console.log(bookings)
    res.render('tennisCourts/show', { court });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const court = await TennisCourt.findById(id);
    if (!court) {
        req.flash('error', 'Cannot find that tennis court!');
        return res.redirect('/tenniscourts');
    }
    res.render('tennisCourts/edit', { court });
}

module.exports.updateTennisCourt = async (req, res) => {
    const { id } = req.params;
    const court = await TennisCourt.findByIdAndUpdate(id, { ...req.body.tenniscourt });
    req.flash('success', 'Successfully updated tennis court!');
    res.redirect(`/tenniscourts/${court._id}`);
}

module.exports.deleteTennisCourt = async (req, res) => {
    const { id } = req.params;
    await TennisCourt.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted tennis court');
    res.redirect('/tenniscourts');
}

module.exports.search = async(req, res) => {
    const find_by = req.query.find_by;
    const location = req.query.location;
    let result = await TennisCourt.find();
    let tennisCourts = [];
    if (find_by === "name") {
        result.forEach(court => {
            if (court.name.toLowerCase().includes(location.toLowerCase())) {
                tennisCourts.push(court);
            }
        })
    } else if (find_by === "city") {
        result.forEach(court => {
            if (court.city.toLowerCase().includes(location.toLowerCase())) {
                tennisCourts.push(court);
            }
        })
    } else if (find_by === "zipcode") {
        result.forEach(court => {
            if (court.zipcode === location) {
                tennisCourts.push(court);
            }
        })
    } else {
        result = tennisCourts;
    }
    res.render('tennisCourts/index', { tennisCourts })
}