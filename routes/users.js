var express = require('express');
var router = express.Router();
var db = app.get('db'),
    User = db.User;

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.create({
    name: 'John Hancock',
  });
  res.json("ok");
//  res.send('respond with a resource');
});

module.exports = router;
