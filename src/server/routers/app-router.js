var express = require('express'),
    bodyParser = require('body-parser'),
    rek = require('rekuire'),
    path = require('path');

var settings = rek('settings'),
    logger = rek('winstonlog');

var app = express();

// app.get(/^\/admin/, function (res, res) {
//     res.sendFile(path.join(settings.path, '/web/admin/html/admin.html'));
// });
app.use(express.static(path.join(settings.path, '/web/public')));

/************************************************************************/
/*                              REST API                                */
/************************************************************************/
app.use(bodyParser({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    logger.info('GET App');
    res.sendFile(path.join(settings.path, '/web/public/html/index.html'));
});

module.exports = app;