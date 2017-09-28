/**
* You'll need to use environment variables in order to deploy your
* pg-pool configuration to Heroku.
* It will look something like this:
**/

var pg = require('pg');
var url = require('url');
var config = {};

// if (process.env.DATABASE_URL) {
//     // Heroku gives a url, not a connection object
//     // https://github.com/brianc/node-pg-pool
//     var params = url.parse(process.env.DATABASE_URL);
//     var auth = params.auth.split(':');

//     config = {
//         user: auth[0],
//         password: auth[1],
//         host: params.hostname,
//         port: params.port,
//         database: params.pathname.split('/')[1],
//         ssl: true, // heroku requires ssl to be true
//         max: 10, // max number of clients in the pool
//         idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
//     };

// } else {
//     config = {
//         user: process.env.PG_USER || null, //env var: PGUSER
//         password: process.env.DATABASE_SECRET || null, //env var: PGPASSWORD
//         host: process.env.DATABASE_SERVER || 'localhost', // Server hosting the postgres database
//         port: process.env.DATABASE_PORT || 5432, //env var: PGPORT
//         database: process.env.DATABASE_NAME || 'aeon', //env var: PGDATABASE
//         max: 10, // max number of clients in the pool
//         idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
//     };
// }
if (process.env.DATABASE_URL) {
    // Heroku gives a url, not a connection object
    // https://github.com/brianc/node-pg-pool
    var params = url.parse(process.env.DATABASE_URL);
    var auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true, // heroku requires ssl to be true
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };

} else {
    config = {
        user: process.env.PG_USER || 'gjwkjldrwdeewz', //env var: PGUSER
        password: process.env.DATABASE_SECRET || 'ff782da7ce598f19dde77e18f1fb23fa9427907299f20a5bf05cc9c4703a43d4', //env var: PGPASSWORD
        host: process.env.DATABASE_SERVER || 'ec2-54-235-88-58.compute-1.amazonaws.com', // Server hosting the postgres database
        port: process.env.DATABASE_PORT || 5432, //env var: PGPORT
        ssl: true,
        database: process.env.DATABASE_NAME || 'da3pjofiv53389', //env var: PGDATABASE
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
    console.log('config', config);
    
}

module.exports = new pg.Pool(config);