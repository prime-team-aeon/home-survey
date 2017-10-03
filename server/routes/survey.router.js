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






module.exports = router;