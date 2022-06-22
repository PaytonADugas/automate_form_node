var url = require('url');
var ObjectID = require('mongodb').ObjectID

// DATABASE Connection
//Import the mongoose module
var mongoose = require('mongoose');
var db = mongoose.connection;

// Helper functions
var helper = require('./helper');
var admin_users = helper.admin_users;
var sendEmail = helper.sendEmail;


// Exports

exports.students_to_regegister = function(req, res, next) {
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
     res.render('students_to_reregister', { students: current_user_students, user: username });
  });
};
 
exports.selectStudent = function(req, res, next) {
  var permission = false;
  if(admin_users.includes(req.user.user_id))
    permission = true;
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id){
        res.render('reregister_student', { student : result[i]});
      }
    }
  });
};

exports.updateStudent = function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  updateStudentFull(id, req).then(() => {
    res.redirect('/reregisterStudents');
  });
};

exports.students = function(req, res, next){
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
    res.render('students', { students: current_user_students, user: username});
  });
};

exports.sort = function(req, res, next){
  req.session.sort = req.body.sort_type;
  res.redirect('/students');
};

exports.select = function(req, res, next){
  var permission = false;
  if(admin_users.includes(req.user.user_id))
    permission = true;
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id){
        res.render('student', { student: result[i], student_id: id});
      }
    }
  });
};

exports.delete = function(req, res, next){
  delete_student(req.body.confirm_name).then(() => {
    res.redirect('/students');
  });
};

exports.edit = function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('edit_student', { student: result[i], student_id: id});
    }
  });
};

exports.commit = function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  updateData(id, req).then(() => {
    res.redirect(`/student?id=${id}`);
  });
};

async function updateStudentFull(id, req) {
  try {
    await db.collection('students').updateOne(
      {'_id': ObjectID(id)},
      { $set: {
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
        HSLDA_membership_expires: req.body.HSLDA_membership_expires
      }}
    );
  } catch(err){
    console.log(err);
  }
}

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
      if(result[i]._id == id){}
        // sendEmail('u',result[i].first_name, result[i].last_name, id)
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
    html: `<h2>${message}<\h2><a href='https://nccsregistration.herokuapp.com/student?id=${id}'>`+f+' '+l+'</a>'
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



