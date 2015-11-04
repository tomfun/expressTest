'use strict';

var randtoken = require('rand-token');
var hasher = require('password-hash');

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email:    {
            type:      DataTypes.TEXT,
            validate:  {
                isEmail: {
                    msg: "Must be a email"
                },
                //fuck:      function (value) {
                //    throw new Error('Only fucked values are allowed!');
                //}
            },
            allowNull: false,
        },
        name:     DataTypes.STRING,
        phone:    DataTypes.STRING,
        password: DataTypes.STRING,

        token: DataTypes.STRING,
        bio:   DataTypes.STRING,
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        hooks:        {
            beforeCreate: function (inst, opt, fn) {
                inst.token = randtoken.generate(16);
                inst.password = hasher.generate(inst.password);
                fn();
            }
        }
    });

    User.verifyPassword = function (password, user) {
        return !(user && hasher.verify(password, user.password)) && [
                {
                    field:   'password',
                    message: "Wrong email or password",
                }
            ];
    };

    return User;
};