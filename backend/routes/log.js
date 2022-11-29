const express = require('express');
const MysqlConnection = require('./mysql/connection')
const router = express.Router();

function execSql(con, data) {
    return new Promise(function (res, rej) {
        con.query(
            `INSERT INTO log (cmd, info)
             VALUES ('${data.cmd}', '${data.info}')`,
            function (err, results) {
                if (err) rej(err);
                else res(results);
            }
        );
    });
}

/* add log entry. */
router.post('/', (req, res) => {
    const con = MysqlConnection.getInstance();
    if (!req.body.info || !req.body.cmd)
        return res.status(400).send('Incomplete Data');
    execSql(con, req.body).then(result => {
        res.status(201).send()
    })
})

module.exports = router;