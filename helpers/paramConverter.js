'use strict';

var config = require('../config');
var _ = require('lodash');
var db = require('../models/db');
var Sequelize = db.Sequelize;


var paramConverter = function (router, Model, paramName, dbName, reqName) {
    var opts;
    if (_.isObject(paramName)) {
        opts = paramName;
        paramName = opts.paramName;
        dbName = opts.dbName;
        reqName = opts.reqName;
    }
    if (!(Model instanceof Sequelize.Model)) {
        if (_.isString(Model)) {
            if (!(Model = db[Model])) {
                throw new Error("wrong model name for param converting");
            }
        }
    }
    if (!dbName) {
        dbName = paramName;
    }
    if (!reqName) {
        reqName = Model.name.substr(0, 1).toLowerCase() + Model.name.substr(1).toLowerCase();
    }
    router.param(paramName, function (req, res, next, paramValue) {
        var query = {where: {}};
        query.where[dbName] = paramValue;
        Model.findOne(query).then(function (model) {
            if (!model) {
                if (config.autoConverter.send404) {
                    res.status(404);
                    if (config.autoConverter.sendBodyMessage) {
                        res.send('Auto converting: not found ' + String(Model) + ' with ' + dbName + ': ' + paramValue);
                    } else {
                        res.send();
                    }
                }
            } else {
                if (req[reqName]) {
                    throw new Error("Auto converting: parameter: " + reqName + " already exist, you must avoid that");
                }
                req[reqName] = model;
                next();
            }
        });
    });
};

module.exports = paramConverter;
