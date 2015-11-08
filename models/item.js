'use strict';
var _ = require('lodash');

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
        classMethods: {
            itemSerializer: function (item, user) {
                item = _.pick(item.get({plain: true}), [
                    'id',
                    'created_at',
                    'title',
                    'price',
                    'user_id',
                    'user',
                    'image'
                ]);
                if (!item.user) {
                    if (!user) {
                        throw new Error('user is undefined');
                    }
                    item.user = _.isPlainObject(user) ? user : user.get({plain: true});
                }
                item.user = _.pick(item.user, ['id', 'phone', 'name', 'email']);
                return item;
            }
        },
    });

    Item.belongsTo(User, {
        foreignKey: {
            name:      'user_id',
            allowNull: false
        },
        as:         'user'
    });

    return Item;
};