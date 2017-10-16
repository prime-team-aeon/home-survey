var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// get a dataset for reporting purposes. takes in an array of properties and a year, and sends back the matching dataset
router.get('/data', function (req, res) {

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            var properties = req.query.properties;
            var year = req.query.year;

            var propBlingString = "";

            if (typeof properties === 'string') {
                propBlingString = "$2"
            } else {
                // properties is an array
                for (var i = 0; i < properties.length; i++) {
                    propBlingString += "$" + (i + 2) + ",";
                }
                propBlingString = propBlingString.slice(0, -1);
            }

            queryString = 'SELECT * FROM responses WHERE year IN ($1) AND property IN (' + propBlingString + ')';

            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('db connect error', err);
                    res.sendStatus(500);
                } else if (typeof properties === 'string') {
                    client.query(queryString, [year, properties], function (err, data) {
                        done();
                        if (err) {
                            console.log('data select query error', err);
                            res.sendStatus(500);
                        } else {
                            res.send(data.rows);
                        }
                    });
                } else {
                    client.query(queryString, [year, ...properties], function (err, data) {
                        done();
                        if (err) {
                            console.log('data select query error', err);
                            res.sendStatus(500);
                        } else {
                            res.send(data.rows);
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

// Add a new property. called from admin-properties view
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

// Add a new unit to a property. called from admin-properties view
router.post('/new-unit', function (req, res) {

    var thisYear = new Date();
    thisYear = thisYear.getFullYear();

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('INSERT INTO occupancy (property, unit, year, occupied) VALUES ($1, $2, $3, $4)', [
                            req.body.property,
                            req.body.unit,
                            thisYear,
                            true
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

// Delete a property unit. called from admin-properties view
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

// Update unit occupied status. called from admin-properties view
router.put('/updateOccupied', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator' || req.user.role == 'Site Manager') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('UPDATE occupancy SET occupied=$1 WHERE id=$2 RETURNING *;', [
                            req.body.occupied,
                            req.body.id
                        ],
                        function (errQuery, data) {
                            done();
                            if (errQuery) {
                                console.log('Error making database query', errQuery);
                                res.sendStatus(500);
                            } else {
                                res.send(data.rows)
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

// GET a selected property from the admin edit properties page
router.get('/selectedProperty', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    //query
                    client.query('SELECT * FROM occupancy WHERE property=$1 AND year=$2;', [req.query.selectedProperty, req.query.year], function (err, data) {
                        done();
                        if (err) {
                            console.log('query error', err);
                        } else {
                            console.log('data.row', data.rows);
                            
                            res.send(data.rows);
                        }
                    });
                }
            });
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }

});

// return the response rate for a passed array of properties (or 'all')
router.get('/responses', function (req, res) {
    // req.params.properties is either a string ('all') or an array of properties

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator' || req.user.role == 'Site Manager') {
            var properties = req.query.properties;

            console.log('properties', properties);
            
            if (properties == 'all') {
                queryString = 'SELECT COUNT(*) FROM occupancy WHERE responded=$1';
                secondQueryString = 'SELECT COUNT(*) FROM occupancy WHERE occupied=$1';
                properties = '';
            } else {
                var propBlingString = "";

                if (typeof properties === 'string') {
                    propBlingString = "$2";
                    properties = [properties];
                } else {
                    // properties is an array
                    for (var i = 0; i < properties.length; i++) {
                        propBlingString += "$" + (i + 2) + ",";
                    }
                    propBlingString = propBlingString.slice(0, -1);
                }

                queryString = 'SELECT COUNT(*) FROM occupancy WHERE responded=$1 AND property IN (' + propBlingString + ')';
                secondQueryString = 'SELECT COUNT(*) FROM occupancy WHERE occupied=$1 AND property IN (' + propBlingString + ')';

            }

            // console.log('queryString', queryString);
            // console.log('secondQueryString', secondQueryString);
            

            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('db connect error', err);
                    res.sendStatus(500);
                } else {
                    client.query(queryString, [true, ...properties], function (err, data) {
                        done();
                        if (err) {
                            console.log('data count query error', err);
                            res.sendStatus(500);
                        } else {
                            // data.rows[0].count is a string of how many responses we have
                            let responses = data.rows[0].count;
                            // console.log('responses', responses);
                            
                            pool.connect(function (err, client, done) {
                                client.query(secondQueryString, [true,...properties], function (err, data) {
                                    done();
                                    if (err) {
                                        console.log('data count2 query error', err);
                                        res.sendStatus(500);
                                    } else if (data.rows[0].count > 0) {
                                        // data.rows[0].count is a string of how many occupied units we have
                                        let occupied = data.rows[0].count;
                                        // console.log('occupied', occupied);
                                        
                                        let responseRate = responses / occupied;
                                        // console.log('responseRate', responseRate.toString());
                                        
                                        res.send(responseRate.toString());
                                    } else {
                                        res.send('no occupied units found');
                                    }
                                });
                            });
                        }
                    });
                }
            });


        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }

});

module.exports = router;