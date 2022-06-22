const mongoose = require('mongoose');

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Define a schema
var Schema = mongoose.Schema;

// user.js
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  first_name: {
    type: String,
    unique: false,
    required: true,
  },
  last_name: {
    type: String,
    unique: false,
    require: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

module.export = mongoose.model('userLogin', UserSchema);