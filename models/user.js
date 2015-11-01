'use strict';

var randtoken = require('rand-token');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email:    DataTypes.STRING,
        name:     DataTypes.STRING,
        phone:    DataTypes.STRING,
        password: DataTypes.STRING,

        token: DataTypes.STRING,
        bio:   DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        hooks: {
            beforeCreate: function (inst, opt, fn) {
                inst.token = randtoken.generate(16);
                fn();
            }
        }
    });
    return User;
};