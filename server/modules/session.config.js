var session = require('express-session');

module.exports = session({
   secret: 'secret',
   key: 'user', // this is the name of the req.variable. 'user' is convention, but not required
   resave: 'true',
   saveUninitialized: false,
   cookie: { maxage: 60 * 30 * 1000, secure: false }
});
