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
                client.query('SELECT username, active, role FROM users', function (err, data) {
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

module.exports = router;