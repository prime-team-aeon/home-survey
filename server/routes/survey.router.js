var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');


router.get('/', function (req, res) {
    console.log('survey');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT * FROM questions', function (err, data) {
                    done();
                    if (err) {
                        console.log('query error', err);
                    } else {
                        console.log('else')
                        // send response data back to client

                       
                       

                        res.send(data.rows);
                    }
                });
            }
        });

    }
});
module.exports = router;