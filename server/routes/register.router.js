var express = require('express');
var router = express.Router();
var path = require('path');
var pool = require('../modules/pool.js');
var encryptLib = require('../modules/encryption');
var randomstring = require('randomstring');

router.get('/verify/:token', function(req,res){
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

  if (req.body.username.indexOf('aeonmn.org') === -1) {
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
            res.sendStatus(201);
          }
        });
    });
  }
});


module.exports = router;