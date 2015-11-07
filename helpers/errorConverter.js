'use strict';

var _ = require('lodash');

var errorTransform = function (err) {
    var out = [],
        strangeError = !_.isArray(err.errors);
    _.each(err.errors, function (v) {
        //var e = {
        //    [v.path]: v.message
        //};
        var e = {};
        e[v.path] = v.message;
        strangeError = strangeError || v.type !== "Validation error";
        out.push(e);
    });
    if (strangeError) {
        console.error(err);
    }
    return out;
};
var errorConverter = function (res) {
    return function (err) {
        res.status(422).send(errorTransform(err));
    };
};

module.exports = errorConverter;
