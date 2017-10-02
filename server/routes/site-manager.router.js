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
                client.query('SELECT * FROM occupancy', function (err, data) {
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

module.exports = router;