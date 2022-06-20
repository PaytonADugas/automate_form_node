// DATABASE Connection
// Import the mongoose module
var mongoose = require('mongoose');

// Sending emails
var helper = require('./helper');
var sendEmail = helper.sendEmail;

require('../models/student.js');
const StudentModel = mongoose.model('student');


exports.fill = function(req, res, next) {
  res.render('form', { last_student: 'null'});
};

exports.save = function(req, res, next){
  var student = saveStudent(req);

  console.log(req.body.refill);

  if(req.body.refill == 'yes')
    res.render('form', { last_student: student });
  else
    res.render('thankyou', { user: req.user || '' });
};

// Current date
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

today = year + "-" + month + "-" + day;


// ---------------------- Helper Functions -------------------------- //

function saveStudent(req){
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

  student.save(function (err) {
    sendEmail('s', req.body.first_name, req.body.last_name, student._id);
    if (err) return handleError(err);
  });

  return student;
}

