const express = require('express');
const MysqlConnection = require('./mysql/connection')
const router = express.Router();

function execSql(con, recordsNumber) {
    return new Promise(function (res, rej) {
        con.query(
            `SELECT * FROM user limit ${recordsNumber}`,
            function (err, results) {
                if (err) rej(err);
                else res(results);
            }
        );
    });
}

/* GET users listing. */

router.get('/', (req, res) => {
  const recordsNumber = Number(req.query.n);
  if(!recordsNumber)
    res.status(400).send('numbers only');
  else{
    const con = MysqlConnection.getInstance();
    execSql(con, recordsNumber).then(() => {
      res.send(200)
    })
  }
})


module.exports = router;
