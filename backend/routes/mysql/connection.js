const mysql = require("mysql2");

class MysqlConnection {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!MysqlConnector.instance) {
            MysqlConnector.instance = new MysqlConnector();
        }
        return MysqlConnector.instance;
    }
}

class MysqlConnector {
    con = '';

    constructor() {
        if (!this.con) {
            this.connect();
            return this.con;
        } else
            return this.con;
    }

    connect() {
        try {
            this.con = mysql.createConnection({
                host: process.env.HOST,
                user: process.env.USER,
                password: process.env.PASSWORD,
                port: process.env.PORT,
                database: process.env.DATABASE
            });
            this.con.connect(function (err) {
                if (err) throw err;
                console.log("MYSQL Connected!");
            });
            return true;
        } catch (e) {
            throw e;
        }
    }
}

module.exports = MysqlConnection;
