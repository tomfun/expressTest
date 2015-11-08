var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var config = require('./config');
var db = require('./models/db');

var errorConverter = require('./helpers/errorConverter');
var paramConverter = require('./helpers/paramConverter');
app.set('errorConverter', errorConverter);
app.set('paramConverter', paramConverter);
app.set('db', db);

global.app = app;
global.appGet = app.get.bind(app);

var authorization = require('./helpers/authorization');

var routes = require('./routes/index');
var users = require('./routes/users');
var items = require('./routes/items');

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

app.use(authorization(config.security.unsecureUrls, function (req, res, next, token) {
    console.log('Token: ' + token);
    req.getCurrentUser = function() {
        return db.User.findOne({where: {token: token}});
    };
    req.currentUserToken = token;
    return next();
}));

app.use('/', routes);
app.use('/api', users);
app.use('/api', items);

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
