const mysql2 = require('mysql2/promise');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kaisa0903',
    database: 'user'
})

module.exports = connection