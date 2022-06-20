// Admins
var helper = require('./helper');
var admin_users = helper.admin_users;

exports.index = function(req, res, next) {
    console.log('this is the index');
    res.render('index');
};

exports.home = function(req, res, next) {
    res.render('home', { role: admin_users.includes(req.user.user_id), user: req.user});
};

exports.thankyou = function(req, res, next) {
    res.render('thankyou', { user: req.user || '' });
};