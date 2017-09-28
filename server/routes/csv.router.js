var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// Handles CSV upload from admin view
router.post('/upload', function (req, res) {
  console.log('/csv/upload POST');

  // 'INSERT INTO occupancy (name, message) VALUES ($1, $2, $3), ($4,$5,$6), [...];'
  if (req.isAuthenticated()) {
    console.log('req.body', req.body);
    var unitsArray = req.body.data;
    var queryString = 'INSERT INTO occupancy (property, unit, year) VALUES (';

    var explodedArray = [];
    
    for (let i = 1; i < unitsArray.length; i++) {
      if (unitsArray[i].length === 3) {
        for (let j = 0; j < unitsArray[i].length; j++) {
          queryString += '$' + (j + ((i - 1) * 3) + 1) + ',';
          explodedArray.push(unitsArray[i][j]);          
        }
        queryString = queryString.slice(0, -1);
        queryString += '),(';
      }
    }

    // if (unitsArray.length > 0){
    //   queryString += '$1';
    // }

    // for (let i = 1; i < unitsArray.length; i++){
    //   queryString += ', $' + (i + 1);
    // }

    queryString = queryString.slice(0, -2);
    queryString += ';';

    console.log('queryString', queryString);

    console.log('explodedArray', explodedArray);
    
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
});

module.exports = router;