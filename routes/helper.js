// Imports
var nodemailer = require('nodemailer');

// Admin user_ids
var admin_users = ['101324339836012249103', '107618246632011978368', '110031149422602544799'];

exports.admin_users = admin_users;

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

//   let mailDetails = {
//     from: 'NCCS.student.register@gmail.com',
//     to: 'jen@northcountycs.com',
//     subject: subject,
//     html: `<h2>${message}<\h2><a href='https://nccsregistration.herokuapp.com/student?id=${id}'>`+f+' '+l+'</a>'
//   };

  let mailDetails = {
    from: 'NCCS.student.register@gmail.com',
    to: 'payton.dugas@gmail.com',
    subject: subject,
    html: `<h2>${message}<\h2><a href='https://nccs-form-automation.herokuapp.com/student?id=${id}'>`+f+' '+l+'</a>'
  };

  mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
  });
}

exports.sendEmail = sendEmail;