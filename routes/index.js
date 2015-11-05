'use strict';

var express = require('express');
var _ = require('lodash');
var router = express.Router();

router.descr = 'This router only show information, if dev mode enabled';

var fingerTip = String(router);

/* GET home page. */
router.get('/', function (req, res, next) {
    if (appGet('debug')) {
        res.render("console", {
            stack: _.map(app._router.stack, function (v) {
                var source = String(v.handle),
                    res    = {
                        'name':   String(v.name),
                        'handle': source,
                        'itself': v.handle === router,
                        'my':     fingerTip === source,
                        'regexp': String(v.regexp),
                        'descr':  v.handle.descr
                    };
                //console.log(v);
                return res;
            })
        });
    } else {
        next();
    }
});

module.exports = router;
