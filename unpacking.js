#!/usr/bin/env node

console.log('db init...');
var db = require('./models/db');
db.sequelize.sync({force: true}).then(function () {
    console.log('db recreated');
});