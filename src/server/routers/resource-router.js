var express = require('express'),
    bodyParser = require('body-parser'),
    rek = require('rekuire'),
    path = require('path'),
    request = require('request');

var settings = rek('settings'),
    TrendetsDb = rek('db'),
    logger = rek('winstonlog'),
    DbHandler = rek('db-handler');

var router = express.Router();

router.get('/', function (req, res) {
    logger.info('GET Router');
    res.send('LOL');
});
router.use(express.static(path.join(settings.path, '/web/public')))

//addRestResource('Stocks');
addRestResource('Events');
addRestStocksResource();

//  Adds REST resouce for db model with GET, POST handlers
function addRestResource(name) {

    var settings = {
        resource: name,
        model: name
    };

    var dbHandler = new DbHandler();

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
            return dbHandler.getEventsByFilter(req.body)
                .then(function (events) {
                    res.json(events);
                });
        });
}

function addRestStocksResource()
{
    var settings = {
            resource: 'Stocks',
            model: 'Stocks'
    };

    if (typeof name === 'object') 
        settings = name;

    router.route('/' + settings.resource)
        .post(function (req, res) {
            var options = {
                url: req.body['url'],
                headers: {
                    'Host': '195.128.78.52',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',
                    'Accept-Encoding': 'null',
                    'Referer': 'http://www.finam.ru/profile/forex/eur-usd/export/',
                    'Connection': 'keep-alive'
                }
            };
            logger.info("about to send request for stocks");
            request.get(options, callback);
        });

    function callback(error, response, body) {
        logger.info("entered callback");
        if (!error && response.statusCode == 200) {
            var allEvents = [];
            // var json = JSON.parse(body);
            // console.log(123123);
            // console.log(json);
            console.log(body);
        } else{
            logger.error(error);
            console.log(error);
        }
        
    }
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