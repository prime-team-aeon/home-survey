var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT username, active, role FROM users ORDER BY username', function (err, data) {
                    done();
                    if (err) {
                        console.log('query error', err);
                    } else {
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

// Update user active status
router.put('/active', function (req, res) {
    
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users SET active=$1 WHERE username=$2;',
                    [
                        req.body.active,
                        req.body.username
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
    }
});

// Update user role
router.put('/role', function (req, res) {
    
    if (req.isAuthenticated()) {
        pool.connect(function (errDatabase, client, done) {
            if (errDatabase) {
                console.log('Error connecting to database', errDatabase);
                res.sendStatus(500);
            } else {
                client.query('UPDATE users SET role=$1 WHERE username=$2;',
                    [
                        req.body.role,
                        req.body.user.username
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
    }
});

module.exports = router;