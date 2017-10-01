var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');

router.get('/verify/:token', function (req, res) {
  console.log('verify token hit', req.params.token);
  //look for the token in db
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }else{
      //SELECT id, timestamp FROM users WHERE token = 'sAhlEMrt0rL1f3St';
      client.query('SELECT id, timestamp FROM users WHERE token = $1;', [req.params.token], 
      function (err, results) {
        if (err) {
          console.log("query error ", err);
          res.sendStatus(500);
        }else{
          if(results.rows.length == 0){
            //we didn't find the token
            console.log('token not found');
            res.sendStatus(400);
          }else{
            //compare the timestamp against current time
            var userId = results.rows[0].id;
            var then = new Date(results.rows[0].timestamp);
            var now = new Date();
            var timeDiff = now.getTime() - then.getTime();
              if(timeDiff < (24*60*60*1000)){
                //less than 24 hrs difference erase token
                //client.query to remove token and update to true(active)
                //UPDATE user SET active=true, token=null WHERE id=1;
                client.query('UPDATE users SET active=true, token=null WHERE id=$1;',[userId],
                function(err,results){
                  if(err){
                    console.log('query error', err);
                    res.sendStatus(500);
                  }else{
                    res.sendStatus(200)
                  }
                });
                
              }else{
                console.log('expired token');
                res.status(400).send('expired')
              } 
          }
        }
      })


    }
  });
      //if we find the token, we need to check the timestamp, needs to be within 24 hrs
        //if not within 24 hours return 400
        //if we find the token and it's within time frame
          //make them active and erase token from DB
          //send back 200
  //if we don't find the token, we return a 400
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

    // console.log('new user:', saveUser);

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
                // console.log('email sent: ' + info.response);
                res.sendStatus(201);
              }
            })
          }
        });
    });
  }
});


module.exports = router;