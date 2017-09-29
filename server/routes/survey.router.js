var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');


router.get('/one', function (req, res) {
    console.log('survey');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT question_number,english,theme FROM questions WHERE question_number BETWEEN 1 AND 5', function (err, data) {
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




router.get('/two', function (req, res) {
    console.log('survey2');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT question_number,english,theme FROM questions WHERE question_number BETWEEN 6 AND 13', function (err, data) {
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


router.get('/three', function (req, res) {
    console.log('survey3');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT question_number,english,theme FROM questions WHERE question_number BETWEEN 14 AND 18', function (err, data) {
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
router.get('/four', function (req, res) {
    console.log('survey4');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT question_number,english,theme FROM questions WHERE question_number BETWEEN 19 AND 22', function (err, data) {
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
router.get('/demographics', function (req, res) {
    console.log('surveydem');
    if (req.isAuthenticated()) {
        // query db, get all responses
        pool.connect(function (err, client, done) {
            if (err) {
                console.log('error connecting to db', err);
                res.sendStatus(500);
            } else {
                //query
                client.query('SELECT question_number,english,theme FROM questions WHERE question_number BETWEEN 23 AND 27', function (err, data) {
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
