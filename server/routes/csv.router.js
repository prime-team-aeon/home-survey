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

router.get('/export/:year', function (req, res) {
  var tableName = 'responses' + req.params.year;
  
  if (req.isAuthenticated()) {
    // query db, get all responses
    pool.connect(function (err, client, done) {
      if (err) {
        console.log('error connecting to db', err);
        res.sendStatus(500);
      } else {
        // get table names
        client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';", function (err, data) {
          done();
          if (err) {
            console.log('query error', err);
          } else {
            // check that this table exists
            var foundTable = data.rows.find(function (table) {              
              return table.table_name == tableName;
            });

            // for some reason doing the usual $1 and passing [tablename] gave query errors. magnets, how do they work?
            var queryString = 'SELECT * FROM ' + tableName + ';';            

            if (foundTable != undefined) {
              // run the actual query
              client.query(queryString, function (err, data) {
                done();
                if (err) {
                  console.log('query error', err);
                } else {
                  // send response data back to client
                  res.send(data.rows);
                }
              });
            } else {
              res.status(400).send('no data for year ' + req.params.year);
            }
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