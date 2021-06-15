const mongoose = require('mongoose');


//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

var StudentModelSchema = new Schema({
  studentId: String,
  firstName: String,
  lastName: String,
});

// Export Student Model
module.export = mongoose.model('student', StudentModelSchema );
