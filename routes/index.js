var express = require('express');
var router = express.Router();

// to get the access of model
const User = require('../models/user');
// passport model require for passport module
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Patient Appointment Tracker', user: req.user });
});


// GET handler for Login
router.get('/login', (req, res, next)=> {

  let messages = req.session.messages || [];
  req.session.messages = [];
  res.render('login', {title: 'Login to your Account',  messages: messages});
});

// Post handler for Login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/patientsList',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'}));



// GET handler for Register
router.get('/register', (req, res, next)=> {
  res.render('register', {title: 'Create a new Account'});
});

// POST handler for register
router.post('/register', (req, res, next)=> {
  //model is used to register a new user
  User.register(
      new User({
        username: req.body.username
      }),
      req.body.password,
      // callback function
      (err, newUSer) => {
        if (err) {
          console.log(err);
          return res.redirect('/register');
        }else
        {
          req.login(newUSer, (err) => {
            res.redirect('/patientsList');
          });
        }
      }
  );
});

// Get Handler for Logout Page
router.get('/logout', (req, res, next) => {
  //  request object log out the user
  req.logout();
  // send the user back to login page

  res.redirect('/login');
});

//GET: to login through github
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}))


//GET: github/callback
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req,res)=>{
  res.redirect('/patientsList')
})

module.exports = router;