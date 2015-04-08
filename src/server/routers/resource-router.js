var express = require('express'),
    bodyParser = require('body-parser'),
    rek = require('rekuire'),
    path = require('path');

var settings = rek('settings'),
    TrendetsDb = rek('db'),
    logger = rek('winstonlog');

var router = express.Router();

router.get('/', function (req, res) {
    logger.info('GET Router');
    res.send('LOL');
    //res.sendFile(path.join(settings.path, '/web/public/index.html'));
    //res.json({ message: 'Welcome to Qoollo Trendets API' });
});
router.use(express.static(path.join(settings.path, '/web/public')))
// router.use(function (req, res, next) {
//     console.log('// [' + req.method + '] ' + req.originalUrl);
//     next();
// });

addRestResource('Stocks');
addRestResource('Events');

//  Adds REST resouce for db model with GET, POST, UPDATE, DELETE handlers
function addRestResource(name) {

    var settings = {
        resource: name,
        model: name
    };
    if (typeof name === 'object') 
        settings = name; 

    router.route('/' + settings.resource)
        .get(function (req, res) {
            new TrendetsDb().connect()
                .then(function (db) {
                    return db[settings.model].all()
                })
                .then(responseJson(res), responseError(res));
        })
        .post(function (req, res) {
            new TrendetsDb().connect()
                .then(function (db) {
                    return db[settings.model].create(req.body);
                })
                .then(responseJson(res), responseError(res));
        });
}
function responseJson(resp) {
    return function (result) {
        resp.json(result);
    }
}
function responseError(resp) {
    return function (err) {
        if (err && ('' + err).indexOf('SQLITE_CONSTRAINT: FOREIGN KEY constraint failed') !== -1)
            err = 'Cannot delete entry because it is referenced by other entries.';
        resp.status(500).json({ error: 'Serverside error: ' + err });
    }
}

module.exports = router;