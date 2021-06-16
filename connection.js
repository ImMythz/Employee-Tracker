const mysql = require('mysql');

const connection = myssql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ImMyTHz1',
    database: 'employees'
});

connection.connect();

module.exports = connection;