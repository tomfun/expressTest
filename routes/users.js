'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db             = appGet('db'),
    User           = db.User,
    errorConverter = appGet('errorConverter'),
    paramConverter = appGet('paramConverter');

router.descr = 'This router work with user.';

paramConverter(router, User, 'id');
var userSerializer = function (user) {
    return _.pick(user.get({plain: true}), ['id', 'phone', 'name', 'email']);
};

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

/* GET user by id. */
router.get('/user/:id(\\d+)', function (req, res, next) {
    res.json(userSerializer(req.user));
});

/* GET current user. */
router.get('/user/me', function (req, res, next) {
    req.getCurrentUser().then(function (user) {
        res.json(userSerializer(user));
    });
});

/* change current user. */
router.put('/user/me', function (req, res, next) {
    req.getCurrentUser().then(function (user) {
        if (!user) {
            return res.status(401).send();//strange behaviour
        }
        var curPas = req.body.current_password,
            newPas = req.body.new_password,
            fields = _.pick(req.body, ['phone', 'name', 'email']);
        if (newPas !== undefined) {
            if (!curPas) {
                return res.send([{field: "current_password", message: "can't be empty when changing password"}]);
            }
            if (!User.verifyPassword(curPas, user)) {
                return res.send([{field: "current_password", message: "is wrong"}]);
            }
            user.password = newPas;
        }
        user.set(fields).save(function () {
            res.json(userSerializer(req.user));
        });
    }, errorConverter(res));
});

/* GET search users. */
router.get('/user', function (req, res, next) {
    var data = _.pick(req.query, ['name', 'email']),
        where = {};
    _.each(data, function (v, i) {
        if (!v) {
            return;
        }
        where[i] = {$like: '%' + v + '%'};
    });
    User.findAll({where : where}).then(function (users) {
        res.json(_.map(users, userSerializer));
    });
});

module.exports = router;
