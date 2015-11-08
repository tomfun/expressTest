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
            res.status(403).send();
        }
        req.currentUser = user;
        next();
    }, function () {
        res.status(403).send();
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

router.delete('/item/:id(\\d+)', loadCurrentUser, function (req, res, next) {
    var item = req.item;
    if (item.getDataValue('user_id') != req.currentUser.id) {
        return res.status(403).send();
    }
    item.destroy()
        .then(function (item) {
            res.send();
        }, errorConverter(res));
});

/* GET by id. */
router.get('/item/:id(\\d+)', /*loadCurrentUser, */function (req, res, next) {
    //if (req.item.getDataValue('user_id') != req.currentUser.id) {
    //    return res.status(403).send();
    //}
    res.json(itemSerializer(req.item, req.currentUser));
});


/* change item. */
router.put('/item/:id(\\d+)', loadCurrentUser, function (req, res, next) {
    var item = req.item;
    if (item.getDataValue('user_id') != req.currentUser.id) {
        return res.status(403).send();
    }
    item.set(_.pick(req.body, ['title', 'price']))
        .save()
        .then(function (item) {
            res.json(itemSerializer(item, req.currentUser));
        }, errorConverter(res));

});

/* GET search items. */
router.get(/\/item$/, function (req, res, next) {
    var data               = _.pick(req.query, ['order_by', 'order_type']),
        where              = {},
        order,
        direction,
        availableOrder     = ['price', 'created_at'],
        availableDirection = ['ASC', 'DESC'];
    order = data.order_by;
    if (availableOrder.indexOf(order) === -1) {
        order = availableOrder[0];
    }
    direction = data.order_type;
    if (availableDirection.indexOf(direction) === -1) {
        direction = availableDirection[0];
    }
    order = order + ' ' + direction;
    _.each(_.pick(req.query, ['title', 'user_id']), function (v, i) {
        if (!v) {
            return;
        }
        where[i] = {$like: '%' + v + '%'};
    });
    Item.findAll({where: where, order: order}).then(function (items) {
        res.json(_.map(items, itemSerializer));
    });
});

module.exports = router;
