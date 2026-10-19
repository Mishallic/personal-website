const mysql = require('mysql2/promise');
const config = require('../config');

let pool;

// One pool per process, created on first use. Connections are reused and re-established when
// MySQL drops them, and a failing query rejects the caller's promise instead of crashing the app.
// Creating it lazily means an incomplete configuration surfaces as a clear error on the first
// query (serverless) or at startup (app.js), never at import time.
function getPool() {
    if (!pool) {
        config.assertComplete();
        pool = mysql.createPool({
            host: config.db.host,
            port: config.db.port,
            user: config.db.user,
            password: config.db.password,
            database: config.db.database,
            connectionLimit: config.db.connectionLimit,
            waitForConnections: true,
        });
    }
    return pool;
}

module.exports = {getPool};
