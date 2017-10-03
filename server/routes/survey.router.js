var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');


router.get('/language', function (req, res) {
    console.log(req.query.language);
    var language = req.query.language;
    var translation;
    switch (language) {
        case 'english':
            language = "SELECT question_number, english FROM questions WHERE question_number BETWEEN 1 AND 27;";
            translation = 'SELECT type, english FROM translations;';
            break;
        case 'somali':
            language = "SELECT question_number, somali FROM questions WHERE question_number BETWEEN 1 AND 27;"
            translation = 'SELECT type, somali FROM translations;';
            break;
        case 'spanish':
            language = "SELECT question_number, spanish FROM questions WHERE question_number BETWEEN 1 AND 27;"
            translation = 'SELECT type, spanish FROM translations;';
            break;
        case 'hmong':
            language = "SELECT question_number, hmong FROM questions WHERE question_number BETWEEN 1 AND 27;"
            translation = 'SELECT type, hmong FROM translations;';
            break;
    }

    if (req.isAuthenticated()) {
        var surveyObject = {};
        if (req.user.role == 'Resident') {
            // query db, get language selected
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    //query
                    client.query(language, function (err, data) {
                        done();
                        if (err) {
                            console.log('query error', err);
                        } else {
                            surveyObject.questions = data.rows;
                            client.query(translation, function (err, data) {
                                done();
                                // console.log('query result', data.rows)
                                if (err) {
                                    console.log('query error', err);
                                } else {
                                    // send response data back to client
                                    surveyObject.translations = data.rows;
                                    res.send(surveyObject);
                                }
                            });
                            // send response data back to client
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
                        done();
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
   
router.post('/:language', function (req, res) {
    console.log('POST /survey/' + req.params.language, req.body);
    if (req.isAuthenticated()) {
        if (req.user.role == 'Resident') {
            var thisYear = new Date();
            thisYear = thisYear.getFullYear();

            var DEBUG_PROPERTY="chicago";

            queryString = "INSERT INTO responses" + thisYear + " (property, language, answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, answer11, answer12, answer13, answer14, answer15, answer16, answer17, answer18, answer19, answer20, answer21, answer22, answer23, answer24, answer25, answer26, answer27) VALUES ('"

            queryString += DEBUG_PROPERTY + "', '" + req.params.language + "', '";
            
            for (var i = 0; i < req.body.list.length; i++){
                queryString += req.body.list[i].answer + "', '";
            }

            queryString = queryString.slice(0,-3) + ");";

            console.log('queryString:', queryString);

            pool.connect(function(err,client,done){
                if(err){
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    client.query(queryString, function(err, data){
                        done();
                        if (err){
                            console.log('query error', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(201);
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