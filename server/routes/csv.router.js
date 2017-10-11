var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// Handles CSV upload from admin view
router.post('/upload/:year', function (req, res) {

  const OCCUPANCY_ROW_LENGTH = 4;
  const OCCUPANCY_IGNORE_ROWS = 1; // number of rows to ignore at top of imported .csv
  const START_YEAR = 2010; // startpoint for valid year param range
  const END_YEAR = 2100; // endpoint for valid year param range

  if ((START_YEAR < req.params.year) && (req.params.year < END_YEAR)) {
    if (req.isAuthenticated()) {
      if (req.user.role == 'Administrator') {

        // first, delete the old table
        pool.connect(function (err, client, done) {
          if (err) {
            console.log('connect error', err);
            res.sendStatus(500);
          } else {
            client.query('DELETE FROM occupancy WHERE year=$1', [req.params.year], function (err, data) {
              done();
              if (err) {
                console.log('delete query error', err);
                res.sendStatus(500);
              } else {
                var unitsArray = req.body.data;
                console.log('unitsArray[3]', unitsArray[3]);
                
                var queryString = 'INSERT INTO occupancy (property, unit, occupied, year) VALUES (';

                // SQL query looks like:
                // INSERT INTO occupancy (property, unit, occupied, year) VALUES ($1, $2, $3, $4), ($5,$6,$7,$8), [...];

                var explodedArray = [];

                // assuming header row, push any valid row into the explodedArray and build out the query string
                for (var i = OCCUPANCY_IGNORE_ROWS; i < unitsArray.length; i++) {
                  if (unitsArray[i].length === OCCUPANCY_ROW_LENGTH) {

                    // unitsArray[i] is one row of data, something like
                    // ['1822 Park', 'Occupied No Notice', 03, 2017]
                    for (var j = 0; j < unitsArray[i].length; j++) {
                      queryString += '$' + (j + ((i - 1) * 4) + 1) + ',';
                      explodedArray.push(unitsArray[i][j]);
                    }
                    queryString = queryString.slice(0, -1);
                    queryString += '),(';
                    if (i == 3) {
                      console.log('unitsArray[i]', unitsArray[i]);
                      console.log('queryString', queryString);
                    }

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
                });
              }
            });
          }
        });
      } else {
        // not admin role
        res.sendStatus(403);
      }
    } else {
      // not authenticated
      res.sendStatus(403);
    }
  } else {
    // bad year param, return error
    res.status(400).send('bad year parameter')
  }
}); // end POST route

// exports all responses from the passed-in year. called from admin
router.get('/export/:year', function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.role == 'Administrator') {
      // query db, get all responses
      pool.connect(function (err, client, done) {
        if (err) {
          console.log('error connecting to db', err);
          res.sendStatus(500);
        } else {
          var queryString = 'SELECT * FROM responses WHERE year=$1';

          // run the actual query
          client.query(queryString, [req.params.year], function (err, data) {
            done();
            if (err) {
              console.log('query error', err);
            } else {
              // send response data back to client
              res.send(data.rows);
            }
          });

        }
      });

    } else {
      // not admin role
      res.sendStatus(403);
    }
  } else {
    // not authenticated
    res.sendStatus(403);
  }

}); // end GET route

module.exports = router;