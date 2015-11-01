var express = require('express');
var router = express.Router();
var db   = app.get('db'),
    User = db.User;

router.descr = 'This router work with user. Prefix for it is /users.';

router.param('id', function (req, res, next, id) {
    User.findById(id).then(function (user) {
        if (!user) {
            res.status(404).send('not found user with id: ' + id);
        } else {
            req.user = user;
            next();
        }
    });
});
/* GET users listing. */
router.get('/', function (req, res, next) {
    User.create({
        name: 'John Hancock',
    });
    console.log(12)
    res.json("ok#");
//  res.send('respond with a resource');
});
/* GET user. */
router.get('/:id', function (req, res, next) {
    console.log(32)
    res.json("ok@");
//  res.send('respond with a resource');
});

module.exports = router;
