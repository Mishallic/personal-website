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
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                database: process.env.DB_DATABASE
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
