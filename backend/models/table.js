const {getPool} = require('../db/pool');

// Shared read helper for the simple "list rows" tables. `table` is always a constant from a model,
// never user input; values are passed as query parameters.
async function findMany(table, limit) {
    const [rows] = await getPool().query(`SELECT * FROM \`${table}\` LIMIT ?`, [limit]);
    return rows;
}

module.exports = {findMany};
