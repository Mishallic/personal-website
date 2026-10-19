const mysql = require('mysql2/promise');
const config = require('../config');

// One pool for the whole process. Connections are reused and re-established when MySQL drops
// them, and a failing query rejects the caller's promise instead of crashing the app.
const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: config.db.connectionLimit,
    waitForConnections: true,
});

module.exports = pool;
