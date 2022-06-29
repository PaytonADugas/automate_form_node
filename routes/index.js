var express = require('express');
var router = express.Router();

// routs
var site = require('./site');
var student = require('./student');
var form = require('./form');
var auth = require('./auth')
var sheet = require('./sheets')

// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms?retryWrites=true&w=majority';
var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms_testing?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

require('../models/user.js');
const UserModel = mongoose.model('user');

// Admin user_ids
var admin_users = ['101324339836012249103', '107618246632011978368', '110031149422602544799'];

////////////////////////////////// Passport //////////////////////////////////

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
const GOOGLE_CLIENT_ID = '420648149659-dq7mkq3vh733m89otpldhqnqjn8jp43k.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'JIXVQVfIOTlMQcGOczfSnl6R';
//const GOOGLE_REDIRECT = 'https://nccsregistration.herokuapp.com/auth/google/callback';
const GOOGLE_REDIRECT = 'http://localhost:3000/auth/google/callback';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT
  },
  function(accessToken, refreshToken, profile, done) {
    UserModel.findOne({
      user_id: profile.id
    }, function(err, user){
      if(!user){
        var user = new UserModel({
          username: profile.displayName,
          user_id: profile.id,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          provider: 'google',
          google: profile._json
        })
        user.save(function(){
          if(err) console.log(err);
          return done(err, user);
        })
      }else{
        return done(err, user);
      }
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/index' }),
  function(req, res) {
    console.log("THIS IS THE USER ID");
    console.log(req.user.user_id);
    res.render('home', { role: admin_users.includes(req.user.user_id), user: req.user });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/');
}

////////////////////////////////// Routs //////////////////////////////////

router.get('/', site.index);
router.get('/home', site.home);
router.get('/thankyou', site.thankyou);

// router.get('/register', auth.register);
// router.post('/register', auth.sendUser);
// router.get('/login', auth.login);
// router.post('/login', auth.loadUser);

router.get('/reregisterStudents', ensureAuthenticated, student.students_to_regegister);
router.get('/reregisterStudent', ensureAuthenticated, student.selectStudent);
router.post('/reregisterStudent', ensureAuthenticated, student.updateStudent);
router.get('/students', ensureAuthenticated, student.students);
router.post('/students', ensureAuthenticated, student.sort);
router.get('/student', ensureAuthenticated, student.select);
router.post('/student', ensureAuthenticated, student.delete);
router.get('/editStudent', ensureAuthenticated, student.edit);
router.post('/editStudent', ensureAuthenticated, student.commit);

router.get('/registerNewStudent', form.fill);
router.post('/registerNewStudent', form.save);


module.exports = router;