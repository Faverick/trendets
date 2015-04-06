var winston = require('winston'),
	moment = require('moment'),
	mkdirp = require('mkdirp');

var now = moment().format('YYYY-MM-DDTHH-mm-ss');
mkdirp.sync('./logs/debug/');
mkdirp.sync('./logs/error/');

var logger = new (winston.Logger)({
  transports: [
    //new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: './logs/debug/'+now+'.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: './logs/error/'+now+'.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;