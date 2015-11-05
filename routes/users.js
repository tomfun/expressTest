'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db   = appGet('db'),
    User = db.User,
    errorConverter = appGet('errorConverter'),
    paramConverter = appGet('paramConverter');

router.descr = 'This router work with user.';

paramConverter(router, User, 'id');

router.post('/register', function (req, res, next) {
    var newUser = _.pick(req.body, ['phone', 'name', 'email', 'password']);
    if (!newUser) {
        return res.sendStatus(400);
    }
    User.create(newUser).then(function (user) {
        res.json({
            token: user.token
        });
    }, errorConverter(res));
});

router.post('/login', function (req, res, next) {
    var email    = req.body.email,
        password = req.body.password;
    User.findOne({where: {email: email}}).then(function (user) {
        var err;
        if (!(err = User.verifyPassword(password, user))) {
            res.json({
                token: user.token
            });
        } else {
            res.status(422).json(err);
        }
    });
//  res.send('respond with a resource');
});

/* GET user. */
router.get('/user/:id(\\d+)', function (req, res, next) {
    res.json(_.pick(req.user.get({plain: true}), ['id', 'phone', 'name', 'email']));
});

/* GET current user. */
router.get('/user/me', function (req, res, next) {
    req.getCurrentUser().then(function (user) {
        res.json(_.pick(user.get({plain: true}), ['id', 'phone', 'name', 'email']));
    });
});

module.exports = router;
