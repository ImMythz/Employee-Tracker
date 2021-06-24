const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@ImMyTHz1234',
    database: 'employees'
});

connection.connect();

module.exports = connection;