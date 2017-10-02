var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// GET list of user's property
router.get('/', function (req, res) {
    console.log('req.body', req.body);
    console.log('req.user', req.user);
    
    if (req.isAuthenticated()) {
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT * FROM occupancy JOIN occupancy_users ON occupancy.property = occupancy_users.occupancy_property WHERE user_id=$1 ORDER BY occupancy.property, occupancy.unit;', [req.user.id], function (err, data) {
                    done();
                    if (err) {
                        console.log('query error', err);
                    } else {
                        res.send(data.rows);
                    }
                });
            }
        });

    }
});

// Update user role
router.put('/updatePaid', function (req, res) {

    if (req.isAuthenticated()) {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('UPDATE occupancy SET paid=$1 WHERE id=$2;', [
                        req.body.paid,
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
});

module.exports = router;