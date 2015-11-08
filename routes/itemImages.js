'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();
var _ = require('lodash');
var Upload = require('upload-file');
var db             = appGet('db'),
    Item           = db.Item,
    config         = appGet('config'),
    errorConverter = appGet('errorConverter'),
    paramConverter = appGet('paramConverter');

router.descr = 'This router work with items\' images.';

paramConverter(router, Item, 'id');

var loadCurrentUser = appGet('loadCurrentUser');
var itemSerializer = Item.itemSerializer;

router.post('/item/:id(\\d+)/image', loadCurrentUser, function (req, res) {
    var upload = new Upload({
        dest:            config.uploader.destination,
        maxFileSize:     config.uploader.maxSize,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        //rename:          function (name, file) {
        //    console.log(this.fields);
        //    return file.filename;
        //}
    });

    var item = req.item;
    if (item.getDataValue('user_id') != req.currentUser.id) {
        return res.status(403).send();
    }

    upload.on('end', function (fields, files) {
        //if (!fields.channel) {
        //    this.cleanup();
        //    this.error('Channel can not be empty');
        //    return;
        //}
        if (files && Object.keys(files).length === 1) {
            item.image = files[Object.keys(files)[0]].path.replace(config.uploader.base, '');
            item.save().then(function () {
                res.json(itemSerializer(item, req.currentUser));
            }, errorConverter(res));
            return;
        }
        this.cleanup();
        res.status(422).json([{'field': 'image', 'message': 'wrong format'}]);
    });

    upload.on('error', function (err) {
        res.status(422).send(errorConverter.errorTransform(err));
    });

    upload.parse(req);
});

router.delete('/item/:id(\\d+)/image', loadCurrentUser, function (req, res) {
    var item = req.item;
    if (item.getDataValue('user_id') != req.currentUser.id) {
        return res.status(403).send();
    }
    var image = config.uploader.base + item.image,
        done = function (err) {
            if (err) {
                res.status(422).json(errorConverter.errorTransform(err));
                return;
            }
            item.image = null;
            item.save().then(function () {
                res.send();
            }, errorConverter(res));
        };
    fs.unlink(image, done);
});

module.exports = router;
