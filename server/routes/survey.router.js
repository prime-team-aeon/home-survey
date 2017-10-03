var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');


router.get('/one', function (req, res) {
    // console.log('survey');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {
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
                            // console.log('else')
                            // send response data back to client




                            res.send(data.rows);
                        }
                    });
                }
            });
        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});




router.get('/two', function (req, res) {
    // console.log('survey2');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {

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
                            // console.log('else')
                            // send response data back to client




                            res.send(data.rows);
                        }
                    });
                }
            });
        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});


router.get('/three', function (req, res) {
    // console.log('survey3');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {

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
                            // console.log('else')
                            // send response data back to client




                            res.send(data.rows);
                        }
                    });
                }
            });
        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});
router.get('/four', function (req, res) {
    // console.log('survey4');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {

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
                            // console.log('else')
                            // send response data back to client




                            res.send(data.rows);
                        }
                    });
                }
            });
        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});

router.get('/demographics', function (req, res) {
    // console.log('surveydem');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {

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
                            // console.log('else')
                            // send response data back to client
                            res.send(data.rows);
                        }
                    });
                }
            });

        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});

router.get('/questions/:year?', function (req, res) {
    // console.log('GET /questions');
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            var thisYear = new Date();
            thisYear = thisYear.getFullYear();
            var year = req.params.year || thisYear;
            
            pool.connect(function(err,client,done){
                if(err){
                    console.log('db connection error', err);
                    res.sendStatus(500);
                } else {
                    client.query('SELECT * FROM questions ORDER BY question_number', function(err,data){
                        if(err){
                            console.log('db query error', err);
                            res.sendStatus(500);
                        } else {
                            res.send(data.rows);
                        }
                    })
                }
            })

        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});

router.post('/questions/:year?', function (req, res) {
    // console.log('POST /questions', req.body);
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            var thisYear = new Date();
            thisYear = thisYear.getFullYear();
            var year = req.params.year || thisYear;

            var questionToAdd = {
                id: req.body.id,
                english: req.body.english,
                somali: req.body.somali,
                spanish: req.body.spanish,
                hmong: req.body.hmong,
                theme: req.body.theme,
                // year: year,
            }

            var queryString = "UPDATE questions SET english=$1, somali=$2, spanish=$3, hmong=$4, theme=$5 WHERE id=$6;";

            pool.connect(function(err,client,done){
                if(err){
                    console.log('db connection error', err);
                    res.sendStatus(500);
                }else {
                    client.query(queryString, [questionToAdd.english, questionToAdd.somali, questionToAdd.spanish, questionToAdd.hmong, questionToAdd.theme, questionToAdd.id], function(err,data){
                        if(err){
                            console.log('db query error', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });

        } else {
            //not resident role
            res.sendStatus(403);
        }
    } else {
        // not authenticated
        res.sendStatus(403);
    }
});
   

module.exports = router;