var express = require('express');
var url = require('url');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');
var ObjectID = require('mongodb').ObjectID
var pdfForm = require('pdfform.js');
var Blob = require('node-fetch');


// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
//var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms?retryWrites=true&w=majority';
var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms_testing?retryWrites=true&w=majority';

mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Current date
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

today = year + "-" + month + "-" + day;

//Get models
// var models_path = __dirname + '../' + '/models'
// fs.readdirSync(models_path).forEach(function (file) {
//   if (~file.indexOf('.js')) require(models_path + '/' + file)
// })
require('../models/student.js');
const StudentModel = mongoose.model('student');
require('../models/user.js');
const UserModel = mongoose.model('user');

// Admin user_ids
var admin_users = ['101324339836012249103', '107618246632011978368'];

////////////////////////////////// Passport //////////////////////////////////

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
const GOOGLE_CLIENT_ID = '420648149659-dq7mkq3vh733m89otpldhqnqjn8jp43k.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'JIXVQVfIOTlMQcGOczfSnl6R';
//const GOOGLE_REDIRECT = 'https://nccs-form-automation.herokuapp.com/auth/google/callback';
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

////////////////////////////////// Passport //////////////////////////////////

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/home', function(req, res, next) {
  res.render('home', { role: admin_users.includes(req.user.user_id), user: req.user});
});

router.get('/form', function(req, res, next) {
  res.render('form', { student_number: 'null', last_student: 'null'});
});

router.post('/form', function(req, res, next){

  var id = '000';
  var owner_id = 'no owner';
  var owner_name = 'no owner';
  if(req.user){
    owner_id = req.user.user_id;
    owner_name = req.user.username;
  }

  var student = new StudentModel({
    owner: owner_id,
    owner_name: owner_name,
    student_id: id,
    username: 'not set',
    password: 'not set',
    last_name: req.body.last_name,
    first_name: req.body.first_name,
    birth_date: req.body.birth_date,
    age: req.body.age,
    gender: req.body.gender,
    disabilities: req.body.disabilities,
    school_year: req.body.school_year,
    grade: req.body.grade,
    record_permission: req.body.record_permission,
    previous_school_year: req.body.previous_school_year,
    previous_school: req.body.previous_school,
    previous_school_mailing_address: req.body.previous_school_mailing_address,
    previous_school_mailing_address2: req.body.previous_school_mailing_address2,
    previous_school_city: req.body.previous_school_city,
    previous_school_state: req.body.previous_school_state,
    previous_school_zip: req.body.previous_school_zip,
    previous_school_been_suspended: req.body.previous_school_been_suspended,
    father_name: req.body.father_name,
    father_employment: req.body.father_employment,
    mother_name: req.body.mother_name,
    mother_employment: req.body.mother_employment,
    family_address: req.body.family_address,
    family_address2: req.body.family_address2,
    family_city: req.body.family_city,
    family_state: req.body.family_state,
    family_zip: req.body.family_zip,
    family_phone: req.body.family_phone,
    family_email: req.body.family_email,
    student_living_with: req.body.student_living_with,
    student_guardian: req.body.student_guardian,
    family_church: req.body.family_church,
    HSLDA_membership: req.body.HSLDA_membership,
    HSLDA_membership_id: req.body.HSLDA_membership_id,
    HSLDA_membership_expires: req.body.HSLDA_membership_expires,
    primary_teacher: req.body.primary_teacher,
    high_school_eduication: req.body.high_school_eduication,
    high_school_attended: req.body.high_school_attended,
    college_eduication: req.body.college_eduication,
    college_attended: req.body.college_attended,
    college_degree: req.body.college_degree,
    list_training: req.body.list_training,
    membership_agreement: 'agreed',
    curriculum_agreement: 'agreed',
    record_keeping_agreement: 'agreed',
    parent_participation_agreement: 'agreed',
    parent_home_agreement: 'agreed',
    attendance_grades_agreement: 'agreed',
    course_of_study_course_description_agreement: 'agreed',
    read_handbook_agreement: 'agreed',
    change_schools_agreement: 'agreed',
    enrolment_dismissal_agreement: 'agreed',
    parent_direction_agreement: 'agreed',
    read_agreement: 'agreed',
    father_signature: req.body.father_signature,
    father_sign_date: req.body.father_sign_date,
    mother_signature: req.body.mother_signature,
    mother_sign_date: req.body.mother_sign_date,
    HSLDA_membership_id: req.body.HSLDA_membership_id,
    HSLDA_membership_expires: req.body.HSLDA_membership_expires,
    notes: 'no notes',
    dateRecieved: today,
    timeStamp: Date.now(),
    feesRecieved: 'none',
    lettersSent: 'none',
    tdap: ''
  });

  var students_left = req.body.student_number;
  //console.log(students_left);

  student.save(function (err) {
    sendEmail('s', req.body.first_name, req.body.last_name, student._id);
    if (err) return handleError(err);

    if(students_left <= 1)
      res.render('thankyou', { user: req.user || '' });
    else
      res.render('form', { student_number: students_left-1, last_student: student });
  });
});

router.get('/submitted', function(req, res, next){
  var username = req.user.username;
  if(!req.session.sort)
    req.session.sort = 'date';
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    current_user_students = [];
    if(admin_users.includes(req.user.user_id)){
      current_user_students = result;
      username = 'Admin';
    }
    else{
      result.forEach(s => {if(s.owner == req.user.user_id)
        {current_user_students.push(s)}});
    }
    var sorted_students = sort_students(req.session.sort, current_user_students);
    res.render('submitted', { student: current_user_students, user: username});
  });
});

router.post('/submitted', function(req, res, next){
  req.session.sort = req.body.sort_type;
  res.redirect('/submitted');
});

router.post('/submitted', function(req, res, next){
  res.redirect('/submitted');
});

router.get('/student', ensureAuthenticated, function(req, res, next){
  var permission = false;
  if(admin_users.includes(req.user.user_id))
    permission = true;
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student', { student: result[i], student_id: id});
    }
  });
});

router.post('/student', function(req, res, next){
  delete_student(req.body.confirm_name).then(() => {
    res.redirect('/submitted');
  });
});

router.get('/student_edit', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student_edit', { student: result[i], student_id: id});
    }
  });
});

router.post('/student_edit', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  updateData(id, req).then(() => {
    res.redirect(`/student?id=${id}`);
  });
});

router.get('/thankyou', function(req, res){
  res.render('thankyou', { user: req.user || '' });
})

async function updateData(id, req) {
  try {
    await db.collection('students').updateOne(
      {'_id': ObjectID(id)},
      { $set: {
        student_id: req.body.student_id,
        username: req.body.username,
        password: req.body.password,
        age: req.body.age,
        grade: req.body.grade,
        father_name: req.body.father_name,
        father_employment: req.body.father_employment,
        mother_name: req.body.mother_name,
        mother_employment: req.body.mother_employment,
        family_address: req.body.family_address,
        family_city: req.body.family_city,
        family_state: req.body.family_state,
        family_zip: req.body.family_zip,
        family_phone: req.body.family_phone,
        family_email: req.body.family_email,
        student_living_with: req.body.student_living_with,
        student_guardian: req.body.student_guardian,
        family_church: req.body.family_church,
        primary_teacher: req.body.primary_teacher,
        high_school_eduication: req.body.high_school_eduication,
        college_eduication: req.body.college_eduication,
        list_training: req.body.list_training,
        notes: req.body.notes,
        feesRecieved: req.body.feesRecieved,
        lettersSent: req.body.lettersSent,
        tdap: req.body.tdap,
        HSLDA_membership_id: req.body.HSLDA_membership_id,
        HSLDA_membership_expires: req.body.HSLDA_membership_expires
      }}
    );
  } catch(err){
    console.log(err);
  }

  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        sendEmail('u',result[i].first_name, result[i].last_name, id)
    }
  });
}

async function delete_student(id){
  await db.collection("students").deleteOne({'_id': ObjectID(id)});
}

function sort_students(method, list){
  if(method == 'first_name'){
    list.sort(function(a, b) {
      var nameA = a.first_name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.first_name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  else if(method == 'last_name'){
    list.sort(function(a, b) {
      var nameA = a.last_name.toUpperCase(); // ignore upper and lowercase
      var nameB = b.last_name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  else if(method == 'date'){
    list.sort(function(a, b) {
      return b.timeStamp - a.timeStamp;
    });
  }
  return list;
}

function sendEmail(s_u, f, l, id){

  var subject = 'New Registration: '+f+' '+l;
  var message = 'Registration for '+f+' '+l+' can be seen here:'+'\n';

  if(s_u == 'u'){
    subject = 'Student info updated: '+f+' '+l;
    message = 'Update for '+f+' '+l+' can be seen here:'+'\n';
  }

  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'NCCS.student.register@gmail.com',
        pass: 'aqacchwyssuwhbap'
    }
  });

  let mailDetails = {
    from: 'NCCS.student.register@gmail.com',
    to: 'jen@northcountycs.com',
    subject: subject,
    html: `<h2>${message}<\h2><a href='https://nccs-form-automation.herokuapp.com/student?id=${id}'>`+f+' '+l+'</a>'
  };

  // let mailDetails = {
  //   from: 'NCCS.student.register@gmail.com',
  //   to: 'payton.dugas@gmail.com',
  //   subject: subject,
  //   html: `<h2>${message}<\h2><a href='https://nccs-form-automation.herokuapp.com/student?id=${id}'>`+f+' '+l+'</a>'
  // };

  mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
  });
}

module.exports = router;
