var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool.js');

// fetches the list of properties from the db and returns it. One entry per property (for building selectors)
router.get('/properties/:year', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log('error connecting to db', err);
            res.sendStatus(500);
        } else {
            //query
            client.query('SELECT DISTINCT property FROM occupancy WHERE year=$1 ORDER BY property;', [req.params.year],
                function (err, data) {
                    done();
                    if (err) {
                        console.log('query error', err);
                        res.sendStatus(500);
                    } else {
                        res.send(data.rows);
                    }
                });
        }
    })
});

// deauthorizes a site manager for a property. called from admin view
router.put('/properties/deauth', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    // query like DELETE FROM occupancy_users WHERE occupancy_property='chicago' AND user_id=2; 
                    pool.connect(function (err, client, done) {
                        if (err) {
                            console.log('connection err', err);
                            res.sendStatus(500);
                        } else {
                            client.query('DELETE FROM occupancy_users WHERE occupancy_property=$1 AND user_id=$2;', [req.body.property, req.body.id], function (err, data) {
                                done();
                                if (err) {
                                    console.log('deauth query error', err);
                                    res.sendStatus(500);
                                } else {
                                    res.sendStatus(200);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

// authorizes a site manager for a property. called from admin view
router.put('/properties/:auth', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            if (req.body.property && req.body.id) {
                pool.connect(function (err, client, done) {
                    if (err) {
                        console.log('error connecting to db', err);
                        res.sendStatus(500);
                    } else {
                        // query like INSERT INTO occupancy_users (occupancy_property, user_id) VALUES ('columbus', 2); 
                        client.query('INSERT INTO occupancy_users (occupancy_property, user_id) VALUES ($1, $2);', [req.body.property, req.body.id], function (err, data) {
                            done();
                            if (err) {
                                console.log('auth query error', err);
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(201);
                            }
                        });
                    }
                });
            } else {
                // didn't send the needed property and id
                res.sendStatus(400);
            }
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

// gets list of users from the db, returns them WITH the list of properties they're authorized for as part of their objects
router.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    //query
                    client.query('SELECT id, username, active, role FROM users ORDER BY username', function (err, data) {
                        done();
                        if (err) {
                            console.log('get / query error', err);
                        } else {
                            // now we need to get the users' authorized properties
                            pool.connect(function (err, client, done) {
                                if (err) {
                                    console.log('get / connect2 err', err);
                                    res.sendStatus(500);
                                } else {
                                    var userData = data.rows;
                                    pool.connect(function (err, client, done) {
                                        if (err) {
                                            console.log('connection err', err);
                                            res.sendStatus(500);
                                        } else {
                                            client.query('SELECT * FROM occupancy_users', function (err, data) {
                                                done();
                                                if (err) {
                                                    console.log('user-roles.router get / query error', err);
                                                    res.sendStatus(500);
                                                } else {
                                                    // data is the occupancy_users junction table
                                                    // loop through that whole table, pushing authorized properties into user objects
                                                    for (var i = 0; i < data.rows.length; i++) {
                                                        var authorization = data.rows[i];
                                                        // loop through user data, assign the property as a string when user_id is found
                                                        for (var j = 0; j < userData.length; j++) {
                                                            if (authorization.user_id == userData[j].id) {
                                                                if (userData[j].properties == undefined) {
                                                                    userData[j].properties = [];
                                                                }
                                                                userData[j].properties.push(authorization.occupancy_property);
                                                                continue;
                                                            }
                                                        }
                                                    } // loop done, userData should now have all authorized property data
                                                    res.send(userData);
                                                }
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
            });
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
}); // end GET route


// Update user active status
router.put('/active', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('UPDATE users SET active=$1 WHERE username=$2;', [
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
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});


// Update user role
router.put('/role', function (req, res) {

    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (errDatabase, client, done) {
                if (errDatabase) {
                    console.log('Error connecting to database', errDatabase);
                    res.sendStatus(500);
                } else {
                    client.query('UPDATE users SET role=$1 WHERE username=$2;', [
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
        } else {
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});

// deletes a user
router.delete('/:username', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('db connect error', err);
                    res.sendStatus(500);
                } else {
                    client.query('DELETE FROM users WHERE username=$1', [req.params.username], function (err, data) {
                        done();
                        if (err) {
                            console.log('query error', err);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    });
                }
            });
        } else {
            //not admin
            res.sendStatus(403);
        }
    } else {
        //not logged in
        res.sendStatus(403);
    }
});


// GET list of all properties and unit numbers
router.get('/allProperties', function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Administrator') {
            pool.connect(function (err, client, done) {
                if (err) {
                    console.log('error connecting to db', err);
                    res.sendStatus(500);
                } else {
                    //query
                    client.query('SELECT * FROM occupancy ORDER BY occupancy.property;', function (err, data) {
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
            //not admin role
            res.sendStatus(403);
        }
    } else {
        //not authorized
        res.sendStatus(403);
    }
});



module.exports = router;