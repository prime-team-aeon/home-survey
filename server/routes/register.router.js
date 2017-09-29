var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');

router.get('/verify/:token', function (req, res) {
  console.log('verify token hit', req.params.token);
  res.sendStatus(200);
}); //end verify get route

// Handles request for HTML file
router.get('/', function (req, res, next) {
  // console.log('get /register route');
  res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
router.post('/', function (req, res, next) {

  // if (req.body.username.indexOf('aeonmn.org') === -1) {
  if (false) { // DEBUG
    res.status(400).send('bad email');
  } else {

    var saveUser = {
      username: req.body.username,
      password: encryptLib.encryptPassword(req.body.password),
      token: randomstring.generate(16),
      timestamp: new Date()
    };

    console.log('new user:', saveUser);

    pool.connect(function (err, client, done) {
      if (err) {
        console.log("Error connecting: ", err);
        res.sendStatus(500);
      }
      client.query("INSERT INTO users (username, password, timestamp, token) VALUES ($1, $2, $3, $4) RETURNING id", [saveUser.username, saveUser.password, saveUser.timestamp, saveUser.token],
        function (err, result) {
          client.end();

          if (err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(500);
          } else {
            //send verification email with nodemailer
            var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'aeonhomesurvey@gmail.com',
                pass: 'sadhorsenocookie'
              }
            })
            var emailtext = "Thank you for registering. Please click this link to confirm your email address. An Aeon administrator will approve your access levels.";
            emailtext += "\n\nhttp://aeonhomesurvey.com/#/register/verify/" + saveUser.token;
            var mailOptions = {
              from: 'aeonhomesurvey@gmail.com',
              to: saveUser.username,
              subject: 'Aeon Home Survey Registration Confirmation',
              text: emailtext
            }
            transporter.sendMail(mailOptions, function (mailerr, info) {
              if (mailerr) {
                console.log('mailerr', mailerr);
                res.send(500);
              } else {
                console.log('email sent: ' + info.response);
                res.sendStatus(201);
              }
            })
          }
        });
    });
  }
});


module.exports = router;