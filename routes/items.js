'use strict';

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db             = appGet('db'),
    Item           = db.Item,
    errorConverter = appGet('errorConverter'),
    paramConverter = appGet('paramConverter');

router.descr = 'This router work with items.';

paramConverter(router, Item, 'id');

var loadCurrentUser = function (req, res, next) {
    req.getCurrentUser().then(function (user) {
        if (!user) {
            res.status(401).send();
        }
        req.currentUser = user;
        next();
    }, function () {
        res.status(401).send();
    });
};

var itemSerializer = function (item, user) {
    item = _.pick(item.get({plain: true}), ['id', 'created_at', 'title', 'price', 'user_id', 'user', 'image']);
    if (!item.user) {
        if (!user) {
            throw new Error('user is undefined');
        }
        item.user = _.isPlainObject(user) ? user : user.get({plain: true});
    }
    item.user = _.pick(item.user, ['id', 'phone', 'name', 'email']);
    return item;
};

router.post('/item', loadCurrentUser, function (req, res, next) {
    var item = Item.build(_.pick(req.body, ['title', 'price']));

    item.setUser(req.currentUser, {save: false});
    item.save()
        .then(function (item) {
            res.json(itemSerializer(item, req.currentUser));
        }, errorConverter(res));
});

/* GET by id. */
router.get('/item/:id(\\d+)', function (req, res, next) {
    res.json(itemSerializer(req.item, req.currentUser));
});

/* GET current user. */
router.get('/user/me', function (req, res, next) {
    req.getCurrentUser().then(function (user) {
        if (!user) {
            return res.status(401).send();//strange behaviour
        }
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
            var err = User.changePassword(curPas, newPas, user);
            if (err) {
                return res.status(422).json(err);
            }
        }
        user.set(fields).save().then(function () {
            res.json(userSerializer(user));
        }, errorConverter(res));
    }, errorConverter(res));
});

/* GET search users. */
router.get(/\/user$/, function (req, res, next) {
    var data  = _.pick(req.query, ['name', 'email']),
        where = {};
    _.each(data, function (v, i) {
        if (!v) {
            return;
        }
        where[i] = {$like: '%' + v + '%'};
    });
    User.findAll({where: where}).then(function (users) {
        res.json(_.map(users, userSerializer));
    });
});

module.exports = router;
