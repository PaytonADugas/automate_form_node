var express = require('express');
var url = require('url');
var router = express.Router();
var fs = require('fs');
var ObjectID = require('mongodb').ObjectID
const { jsPDF } = require("jspdf");

// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://PaytonADugas:M5x1DR9TeUGRBbt5@nccs.tl9mm.mongodb.net/student_forms?retryWrites=true&w=majority';
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Form' });
});

router.post('/form', function(req, res, next){

  var id = '000';
  var student = new StudentModel({
    student_id: id,
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
    previous_school_city: req.body.previous_school_city,
    previous_school_state: req.body.previous_school_state,
    previous_school_zip: req.body.previous_school_zip,
    previous_school_been_suspended: req.body.previous_school_been_suspended,
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
    HSLDA_membership: req.body.HSLDA_membership,
    primary_teacher: req.body.primary_teacher,
    high_school_eduication: req.body.high_school_eduication,
    college_eduication: req.body.college_eduication,
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
    read_agreement: req.body.read_agreement,
    father_signature: req.body.father_signature,
    father_sign_date: req.body.father_sign_date,
    mother_signature: req.body.mother_signature,
    mother_sign_date: req.body.mother_sign_date,
    HSLDA_membership_id: '',
    HSLDA_membership_expires: '',
    notes: 'no notes',
    dateRecieved: today,
    feesRecieved: 'none',
    lettersSent: 'none',
    tdap: ''
  });

  student.save(function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/submitted', function(req, res, next){
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    res.render('submitted', { student: result});
  });
});

router.get('/student', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  console.log(id);
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student', { student: result[i], student_id: id});
    }
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

async function updateData(id, req) {
  try {
    db.collection('students').updateOne(
      {'_id': ObjectID(id)},
      { $set: {
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
}

// PDF testing

var fillPdf = require("fill-pdf");
var formData = { student_name: 'Payton Dugas' };
var pdfTemplatePath = "PDF/NCCS_Registration_form.pdf";

router.post('/student?id=60d0ec1e927add68886cc9cb', function(req, res) {
  res.send('hello');
  // fillPdf.generatePdf(formData, pdfTemplatePath, function(err, output) {
  //   if(err){
  //     console.log(err)
  //   }
  //   else {
  //     res.type("application/pdf");
  //     res.send(output);
  //   }
  // });
});



module.exports = router;
