var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// Add a new property
router.post('/new-property', function (req, res) {    
    
    var thisYear = new Date();
    thisYear = thisYear.getFullYear();

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('INSERT INTO occupancy (property, unit, year) VALUES ($1, $2, $3)', [
                        req.body.property,
                        req.body.unit,
                        thisYear
                    ],
                        function (errQuery, data) {
                            done();
                            if (errQuery) {
                                console.log('Error making database query', errQuery);
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(201);
                            }
                        });
                }
            });
        } else {
            //not authorized
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

// Delete a property unit
router.delete('/delete-unit', function (req, res) {
    var occupancyId = req.query.occupancyId;
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('db connect error', err);
                    res.sendStatus(500);
                } else {
                    client.query('DELETE FROM occupancy WHERE id=$1', [occupancyId], function (err, data) {
                        done();
                        if (err) {
                            console.log('query error', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        } else {
            //not admin
            res.sendStatus(403);
        }
    } else {
        //not logged in
        res.sendStatus(403);
    }

});

// Update unit occupied status
router.put('/updateOccupied', function (req, res) {
    console.log('updateOccupied req.body', req.body);

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('UPDATE occupancy SET occupied=$1 WHERE id=$2;', [
                        req.body.occupied,
                        req.body.id
                    ],
                        function (errQuery, data) {
                            done();
                            if (errQuery) {
                                console.log('Error making database query', errQuery);
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(201);
                            }
                        });
                }
            });
        } else {
            //not authorized
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

module.exports = router;