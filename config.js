// --- App configuration
var path = require('path');
var env       = process.env.NODE_ENV || 'development';

module.exports = {
    db: {
        database: 'test',
        username: 'test',
        password: '',
        options: {
            host: 'localhost',
            dialect: 'sqlite',//'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',

            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },

            storage: path.join(__dirname, 'database.sqlite'),// SQLite only
        }
    },
    appPort: 3000,
};