'use strict';

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.models.User ? sequelize.models.User : sequelize['import']('./user.js');
    var Item = sequelize.define('Item', {
        created_at: {
            type: DataTypes.VIRTUAL,
            get:  function () {
                return Math.round(this.getDataValue('createdAt').getTime() / 1000);
            },
        },
        title:      {
            type:      DataTypes.STRING,
            validate:  {
                len: [3, 80],
            },
            allowNull: false,
        },
        price:      {
            type:      DataTypes.DECIMAL,
            validate:  {
                isDecimal: true,
                min:       0,
            },
            allowNull: false,
        },
        image:      {
            type: DataTypes.STRING(1000),
        },
    }, {
        defaultScope: {
            include: [
                {model: User, as: 'user'}
            ]
        },
        //scopes: {
        //    owner: {
        //        include: [
        //            {model: User}
        //        ]
        //
        //    }
        //},
        classMethods: {
            //associate: function (models) {
            //
            //},
        },
    });

    Item.belongsTo(User, {
        foreignKey: {
            name: 'user_id',
            allowNull: false
        },
        as:         'user'
    });
    //
    //User.hasMany(Item, {
    //    foreignKey: {
    //        name: 'user_id',
    //        allowNull: false
    //    },
    //    as: 'items'
    //});

    return Item;
};