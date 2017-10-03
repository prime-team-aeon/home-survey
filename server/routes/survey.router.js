var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');


router.get('/language', function (req, res) {
    console.log(req.query.language);
    var language = req.query.language
    switch (language) {
        case 'english':
            language = "SELECT question_number, english FROM questions WHERE question_number BETWEEN 1 AND 27;"
            break;
        case 'somali':
            language = "SELECT question_number, somali FROM questions WHERE question_number BETWEEN 1 AND 27;"
            break;
        case 'spanish':
            language = "SELECT question_number, spanish FROM questions WHERE question_number BETWEEN 1 AND 27;"
            break;
        case 'hmong':
            language = "SELECT question_number, hmong FROM questions WHERE question_number BETWEEN 1 AND 27;"
            break;
    }
    console.log('language is: ', language);

    // var language = req.query.language;
    // language.toString();
    // console.log('language', language)
    if (req.isAuthenticated()) {
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
                        // console.log('query result', data.rows)
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