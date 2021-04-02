// use dotenv for mapbox token (npm i dotenv)
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// use express(npm i express)
const express = require('express');
// for ejs views(npm i ejs)
const path = require('path');
// use mongoose(npm i mongoose)
const mongoose = require('mongoose');
// ejs tool for layout(npm i ejs-mate)
const ejsMate = require('ejs-mate');
// use for cookie, session id is passed to the web server every time when make HTTP request
const session = require('express-session');
// show up the flash on top of page, flash message are stored in the session
const flash = require('connect-flash');
// customized format of error dispaly
const ExpressError = require('./utils/ExpressError');
// method override(npm i method-override) (just 'put', 'post' originally)
const methodOverride = require('method-override');
// use passport for session
const passport = require('passport');
// use passport for authentication and authoriration
const LocalStrategy = require('passport-local');
// use user schema
const User = require('./models/user');

// use different route template
const usersRoutes = require('./routes/users')
const tenniscourtsRoutes = require('./routes/tenniscourts');
const reviewsRoutes = require('./routes/reviews');

// use mongoose connect MongoDB
mongoose.connect('mongodb://localhost:27017/ten-play', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// use mongoose connect MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

// use express
const app = express();

const bodyParser = require('body-parser');
// const url = require('url');
// const querystring = require('querystring');
// const Article = require('./models').Article;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use ejs-mate
app.engine('ejs', ejsMate);
// use env for mapbox token (npm i dotenv)
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// for ejs views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware to parse request body (app.post => res.send(req.body))
app.use(express.urlencoded({ extended: true }));
// method override (just 'put', 'post' originally)
app.use(methodOverride('_method'));
// use 'public' file route
app.use(express.static(path.join(__dirname, 'public')));

// use for cookie, session id is passed to the web server every time when make HTTP request
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expire: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxA: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
// use flash
app.use(flash());

// use passport for session
app.use(passport.initialize());
app.use(passport.session());
// use passoirt-local, generate a function that is used in Passport's LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// generate a function that is used by Passport to serialize/deserialize users into the session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// show flash on new page on one time
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// set route rule and connect  template
app.use('/', usersRoutes);
app.use('/tenniscourts', tenniscourtsRoutes);
app.use('/tenniscourts/:id/reviews', reviewsRoutes);

// home page
app.get('/', (req, res) => {
    res.render('home')
});

// handle by 404 if no any route hitted
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// render the error page includ the status code and error messages
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { err });
});

// port 5000
app.listen(5000, () => {
    console.log('Serving on port 5000');
});