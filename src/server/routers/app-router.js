var express = require('express'),
    bodyParser = require('body-parser'),
    rek = require('rekuire'),
    path = require('path');

var settings = rek('settings'),
    logger = rek('winstonlog'),
    dbHandler = rek('db-handler');

var app = express();

// Задаем путь к ресурсам, который будет использоваться в html файлах  
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

app.post('/', function(req, res) {
    
})

module.exports = app;