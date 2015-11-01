'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db   = app.get('db'),
    User = db.User;

router.descr = 'This router work with user.';

router.param('id', function (req, res, next, id) {
    User.findById(id).then(function (user) {
        if (!user) {
            res.status(404).send('not found user with id: ' + id);
        } else {
            req.user = user;
            next();
        }
    });
});

router.post('/register', function (req, res, next) {
    var newUser = _.pick(req.body, ['phone', 'name', 'email', 'password']);
    if (!newUser) {
        return res.sendStatus(400);
    }
    User.create(newUser).then(function (a,b,c) {
        res.json({
            token: a.token
        });
    });
});

router.post('/login', function (req, res, next) {
    var newUser = _.pick(req.body, ['phone', 'name', 'email', 'password']);
    if (!newUser) {
        return res.sendStatus(400);
    }
    User.create(newUser).then(function () {
        res.json({
            token: 'some_todo'
        });
    });
//  res.send('respond with a resource');
});

/* GET user. */
router.get('/user/:id', function (req, res, next) {
    console.log(32)
    res.json("ok@");
//  res.send('respond with a resource');
});

module.exports = router;
