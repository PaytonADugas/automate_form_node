var express = require('express');
var url = require('url');
var router = express.Router();
var fs = require('fs');


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
  var id = '000' + req.body.firstName.charAt(0).toUpperCase() +  req.body.lastName.charAt(0).toUpperCase();
  var student = new StudentModel({
    studentId: id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  student.save(function (err) {
    if (err) return handleError(err);
    res.redirect('/');
  });
});

router.get('/submitted', function(req, res, next){
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    res.render('submitted', { title: result});
  });
});

router.get('/student', function(req, res, next){
  var queryObject = url.parse(req.url,true).query;
  var id = queryObject.id;
  db.collection("students").find().toArray(function(err, result) {
    if (err) throw err;
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == id)
        res.render('student', { student: result[i]});
    }
  });
});


module.exports = router;
