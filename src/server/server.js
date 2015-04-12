var rek = require('rekuire'),
    logger = rek('winstonlog');

logger.info('Starting Express server...');

var settings = rek('settings'),
    app = rek('app-router'),
    resource = rek('resource-router');

app.use('/api', resource);
app.listen(settings.port);

logger.info('Express server running.');
