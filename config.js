// --- App configuration
var path = require('path');
var env = process.env.NODE_ENV || 'development';
var debug = env === 'development' || env === 'dev';

module.exports = {
    db:       {
        database: 'test',
        username: 'test',
        password: '',
        options:  {
            host:    'localhost',
            dialect: 'sqlite',//'mysql'|'mariadb'|'sqlite'|'postgres'|'mssql',

            pool: {
                max:  5,
                min:  0,
                idle: 10000
            },

            storage: path.join(__dirname, 'database.sqlite'),// SQLite only
        }
    },
    security: {
        unsecureUrls: [
            {
                method: 'post',
                url:    '/api/register',
            },
            {
                method: 'post',
                url:    '/api/login',
            },
            {
                method: 'get',
                url:    '/api/user',//search users
                query:  'any',//all query parameters are optional
            },
            {
                method: 'get',
                url:    '/api/item',
                query:  'any',//search goods
            },
            {
                method: 'get',
                url:    '/api/item/',// must start with "/api/item/"
                params: true, // and may ends with some
                query:  false, // and can't include ?...
            },
        ]
    },
    appPort:  3000,
    autoConverter: {
        send404: true,
        sendBodyMessage: debug,
    },
    uploader:{
        destination: path.join(__dirname, 'public', 'images'),
        base: path.resolve(path.join(__dirname, 'public')),
        maxSize: 1024 * 1024,
    }
};

if (debug) {
    module.exports.security.unsecureUrls.push({
        method: 'get',
        url:    '/',//dev console
    });
}