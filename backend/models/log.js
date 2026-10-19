const {getPool} = require('../db/pool');

const Log = {
    async create({cmd, info}) {
        const [result] = await getPool().query('INSERT INTO `log` (cmd, info) VALUES (?, ?)', [cmd, info]);
        return result.insertId;
    },
};

module.exports = Log;
