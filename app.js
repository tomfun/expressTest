var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var db = require('./models/db');
global.app = app;
app.set('db', db);

var routes = require('./routes/index');
var users = require('./routes/users');

var Twig = require('twig');// Twig module

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.set('debug', app.get('env') === 'development' || app.get('env') === 'dev');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var unsecureUrls = [
    {
        method: 'post',
        url: '/api/register',
    },
    {
        method: 'post',
        url: '/api/login',
    },
    {
        method: 'get',
        url: '/',//search users,
    },
    {
        method: 'get',
        url: '/api/user',//search users
        query: true,
    },
    {
        method: 'get',
        url: '/api/item',
        query: true,//search goods
    },
    {
        method: 'get',
        url: '/api/item/',// must start with "/api/item/"
        params: true, // and may ends with some
        query: false, // and can't include ?...
    },
];
app.use(function (req, res, next) {
    var token = req.get('Authorization');
    if (!token) {

        var _ = require('lodash');
        var urlData = req._parsedOriginalUrl || req._parsedUrl;
        var isOk = _.any(_.filter(unsecureUrls, function(v) {
            var m = v.method;
            return !m || (m = String(m).toUpperCase()) === req.method || m === 'ANY';
        }), function (v) {
            if (v.url === urlData.pathname) {
                return !urlData.search || (v.query === true && urlData.search) || (v.query === urlData.search);
            }
            if (urlData.pathname.indexOf(v.url) === 0) {
                return v.params === true;
            }
            return false;
        });
        if (isOk) {
            return next();
        }
        //console.log(req.originalUrl, req.params, req.query, req._parsedOriginalUrl);
        res.status(401).send();
    } else {
        console.log(token);
        return next();
    }
});
app.use('/', routes);
app.use('/api', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error:   err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error:   {}
    });
});


module.exports = app;
