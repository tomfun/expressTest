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
            },
            unique:    true,
            allowNull: false,
        },
        name:     {
            type:      DataTypes.STRING,
            validate:  {
                not: {
                    args: /^\d+$/,
                    msg:  "Name can\'t consist of numbers"
                },
                len: [2, 48]
            },
            allowNull: false,
        },
        phone:    {
            type:      DataTypes.STRING,
            validate:  {
                is:  {
                    args: /^\+?\d+$/,
                    msg:  "Phone can consist of +38099xxxxxxx"
                },
                len: [6, 14]
            },
            allowNull: false,
        },
        password: {
            type:      DataTypes.STRING,
            allowNull: false,
            set:       function (val) {
                return this.setDataValue('password', hasher.generate(val));
            }
        },

        token: DataTypes.STRING,
        bio:   DataTypes.STRING,
    }, {
        classMethods: {
            //associate:      function (models) {
            //},
            verifyPassword: function (password, user) {
                return !(user && hasher.verify(password, user.password)) && [
                        {
                            field:   'password',
                            message: "Wrong email or password",
                        }
                    ];
            },
            changePassword: function (currentPassword, newPassword, user) {
                if (User.verifyPassword(currentPassword, user)) {
                    return [
                        {
                            field:   'current_password',
                            message: "Wrong email or current_password",
                        }
                    ];
                }
                if (!newPassword) {
                    return [{field: "new_password", message: "can't be empty when changing password"}];
                }
                user.password = newPassword;
                return false;
            }
        },
        hooks:        {
            beforeCreate: function (inst, opt, fn) {
                inst.token = randtoken.generate(16);
                fn();
            }
        }
    });

    return User;
};