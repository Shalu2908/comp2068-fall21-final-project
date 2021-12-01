var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// global vars for various uses (db connection/ passport config)
const globals = require('./config/globals')

// passport for auth
const passport = require('passport')

const session = require('express-session')

// configured passport
app.use(session({
    secret: 'someRandomString@123',
    resave: true,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const User = require('./models/user')
passport.use(User.createStrategy())

// this will set passport to read and write user data
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// passport github config
const github = require('passport-github2').Strategy

passport.use(new github({
        clientID: globals.github.clientID,
        clientSecret: globals.github.clientSecret,
        callbackURL: globals.github.callbackURL
    },
    // callback function handle to check if there is already a user in the DB
    async(accessToken, refreshToken, profile, callback)=> {
        try {

            const user = await User.findOne({oauthId: profile.id})
            if (user) {
                return callback(null, user) // user already exist so return object and continue
            } else {
                const newUser = new User({
                    username: profile.username,
                    oauthId: profile.id,
                    oauthProvider: 'Github',
                })
                const savedUser = await newUser.save();
                return callback(null, savedUser);
            }
        }
        catch(err)
        { callback(err)}
    }))


var indexRouter = require('./routes/index');
// created router object for paientList page
var patientRouter = require('./routes/patientsList');
// ctreated the router for list of categories page
var categoryRouter = require('./routes/categories');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// registered the paths with router
app.use('/patientsList', patientRouter);
app.use('/categories', categoryRouter);

//mongodb connection with mongoose
const mongoose = require('mongoose')

mongoose.connect(globals.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    (res) => {
        console.log('Connected to MongoDB')
    }
).catch(() => {
    console.log('Could not connect to MongoDB')
})

// created HBS helper method to select options from drop down fields
const hbs = require('hbs');
hbs.registerHelper('createOption', (currentValue, selectedValue) => {
    // initialize selected property
    var selectedProperty = '';
    if (currentValue == selectedValue) {
        selectedProperty = 'selected';
    }
    // render html code for  option element
    return new hbs.SafeString("<option " + selectedProperty +">" + currentValue
        + "</option>");
});
// HBS helper method to format the date
hbs.registerHelper('toShortDate', (longDateValue) => {
    return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
