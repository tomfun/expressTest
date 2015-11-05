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
        name:         {
            type: DataTypes.STRING,
            validate: {
                not: {
                    args: /^\d+$/,
                    msg: "Name can\'t consist of numbers"
                },
                len: [2, 48]
            },
            allowNull: false,
        },
        phone:             {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^\+?\d+$/,
                    msg: "Phone can consist of +38099xxxxxxx"
                },
                len: [6, 14]
            },
            allowNull: false,
            scopes: ['some1'],
        },
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