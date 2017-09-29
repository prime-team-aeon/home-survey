var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// Handles CSV upload from admin view
router.post('/upload', function (req, res) {
  console.log('/csv/upload POST');

  const OCCUPANCY_ROW_LENGTH = 3;
  const OCCUPANCY_IGNORE_ROWS = 1; // number of rows to ignore at top of imported .csv

  if (req.isAuthenticated()) {
    console.log('req.body', req.body);
    var unitsArray = req.body.data;
    var queryString = 'INSERT INTO occupancy (property, unit, year) VALUES (';

    // SQL query looks like:
    // INSERT INTO occupancy (name, message) VALUES ($1, $2, $3), ($4,$5,$6), [...];

    var explodedArray = [];

    // assuming header row, push any valid row into the explodedArray and build out the query string
    for (var i = OCCUPANCY_IGNORE_ROWS; i < unitsArray.length; i++) {
      if (unitsArray[i].length === OCCUPANCY_ROW_LENGTH) {
        for (var j = 0; j < unitsArray[i].length; j++) {
          queryString += '$' + (j + ((i - 1) * 3) + 1) + ',';
          explodedArray.push(unitsArray[i][j]);
        }
        queryString = queryString.slice(0, -1);
        queryString += '),(';
      }
    }

    queryString = queryString.slice(0, -2);
    queryString += ';';

    // push the whole thing into the occupancy table of the db
    pool.connect(function (err, client, done) {
      if (err) {
        console.log('error connecting to db', err);
        res.sendStatus(500);
      } else {
        client.query(queryString, explodedArray, function (err, result) {
          done();
          if (err) {
            console.log('error making query', err);
            res.sendStatus(500);
          } else {
            res.sendStatus(201);
          }
        });
      }
    })

  } else {
    // not authenticated
    res.sendStatus(403);
  }
}); // end POST route

router.get('/export', function(req,res){
  console.log('/csv/export');
  if(req.isAuthenticated()){
    // query db, get all responses
    pool.connect(function(err,client,done){
      if(err){
        console.log('error connecting to db', err);
        res.sendStatus(500);
      } else {
        //query
        client.query('SELECT * FROM responses', function(err,data){
          if (err){
            console.log('query error', err);
          } else {
            // send response data back to client

            // this pushes the header row in, which may not work
            // data.rows.unshift(data.fields);
            // res.send(data.rows);

            res.send(data.rows);
          }
        });
      }
    });

  } else {
    // not authenticated
    res.sendStatus(403);
  }
  
}); // end GET route

module.exports = router;