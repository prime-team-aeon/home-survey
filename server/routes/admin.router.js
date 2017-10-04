var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// GET list of user's property
// router.get('/getProperties', function (req, res) {

//     if (req.isAuthenticated()) {
//         if (req.user.role == 'Administrator' || req.user.role == 'Site Manager') {
//             pool.connect(function (err, client, done) {
//                 if (err) {
//                     console.log('error connecting to db', err);
//                     res.sendStatus(500);
//                 } else {
//                     //query
//                     client.query('SELECT * FROM occupancy JOIN occupancy_users ON occupancy.property = occupancy_users.occupancy_property WHERE user_id=$1 ORDER BY occupancy.property, occupancy.unit;', [req.user.id], function (err, data) {
//                         done();
//                         if (err) {
//                             console.log('query error', err);
//                         } else {
//                             res.send(data.rows);
//                         }
//                     });
//                 }
//             });
//         } else {
//             //not admin role
//             res.sendStatus(403);
//         }
//     } else {
//         //not authorized
//         res.sendStatus(403);
//     }

// });

// Add a new property
router.post('/new-property', function (req, res) {    
    
    var thisYear = new Date();
    thisYear = thisYear.getFullYear();

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('INSERT INTO occupancy (property, unit, year) VALUES ($1, $2, $3)', [
                        req.body.property,
                        req.body.unit,
                        thisYear
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
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

module.exports = router;