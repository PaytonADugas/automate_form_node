// DATABASE Connection
//Import the mongoose module
var mongoose = require("mongoose");

require("../models/userLogin.js");
const UserLoginModel = mongoose.model("userLogin");

// auth.js
exports.sendUser = async (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  console.log(first_name);
  console.log(last_name);
  console.log(email);
  console.log(password);

  UserLoginModel.findOne({
      email: email,
    },
    function (err, user) {
      if (!user) {
        var user = new UserLoginModel({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
        });
        user.save(function () {
          if (err) console.log(err) 
          else res.render('home');
        });
      } else {
        console.log('user already exists');
      }
    }
  );
};

exports.register = (req, res, next) => {
  res.render("register");
};

exports.loadUser = async (req, res, next) => {
  const { email, password } = req.body;
  // check if a username and password was provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  } else {
    try {
      const user = await UserLoginModel.findOne({
        email: email,
        password: password,
      });

      if (!user) {
        res.status(401).json("No user found");
      } else {
        res.render("home");
      }
    } catch {
      res.status(400).json("an error occurred");
    }
  }
};

exports.login = (req, res, next) => {
  res.render('login');
};
