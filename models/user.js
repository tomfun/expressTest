'use strict';
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
        }
    });
    return User;
};