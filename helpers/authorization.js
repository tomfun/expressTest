'use strict';

var _ = require('lodash');

module.exports = function (unsecureUrls, cb) {
    return function (req, res, next) {
        var token = req.get('Authorization');
        if (!token) {
            var urlData = req._parsedOriginalUrl || req._parsedUrl;
            var isOk = _.any(_.filter(unsecureUrls, function(v) {
                var m = v.method;
                return !m || (m = String(m).toUpperCase()) === req.method || m === 'ANY';
            }), function (v) {
                if (v.url === urlData.pathname) {
                    return !urlData.search
                        || (v.query === true && urlData.search)
                        || (v.query === urlData.search)
                        || (v.query === 'any');
                }
                if (urlData.pathname.indexOf(v.url) === 0) {
                    return v.params === true;
                }
                return false;
            });
            if (isOk) {
                return next();
            }
            //console.log(req.originalUrl, req.params, req.query, req._parsedOriginalUrl);
            res.status(401).send();
        } else {
            return cb(req, res, next, token);
        }
    };
};
