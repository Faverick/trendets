
//TODO: написать доки
var request = require('request'),
	moment = require('moment'),
	q = require('q'),
	rek = require('rekuire'),
	logger = rek('winstonlog');

function parseStocks(quote, dateFrom, dateTo, granularity, sendToFunc){
	var d = q.defer();
	var momentFrom = moment(dateFrom),
		momentTo = moment(dateTo);

	if (!momentFrom.isValid() || !momentTo.isValid() || !momentFrom.isBefore(momentTo)){
		throw new Error('Date parameters have a bad value.');
	}

	//TODO: проверка параметров, преобразование времени к http запросу
	var url = 'http://api-sandbox.oanda.com/v1/' +
		'candles?instrument=' + quote + '&granularity=' + granularity + '&start=' + encodeURIComponent(dateFrom) +
		'&end=' + encodeURIComponent(dateTo) + '&candleFormat=midpoint';
	//TODO: отдельно написать колбэк
	request(url, function(error, response, body){
		if (error) {
			console.error(error);
			d.reject(error);
		} else if (response.statusCode == 200) {
			var quotes = parseQuotes(body);
			d.resolve(quotes);
		}
	})
	d.promise;
}

parseCurrencyQuotes(quote, fromDate, toDate, granularity){

}

function parseQuotes(responseBody){
	var parsedBody = JSON.parse(responseBody);
	var	rawQuotes = parsedBody.candles,
		quotes = [];
	for (var i = 0; i < rawQuotes.length; i++) {
		var c = rawQuotes[i];
		quotes.push({
			date: new moment(c.time),
			open: c.openMid,
			high: c.highMid,
			low: c.lowMid,
			close: c.closeMid
		});
	}
	return quotes;
}

parseStocks('EUR_USD', '2014-01-01T00:00:00Z', '2015-01-01T00:00:00Z', 'D');
//module.exports.parseStocks = parseStocks;