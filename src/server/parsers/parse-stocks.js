
//TODO: написать доки
var request = require('request'),
	moment = require('moment'),
	q = require('q');

function parseStocks(quote, fromDate, toDate, granularity, sendToFunc){
	var d = q.defer();
	//TODO: проверка параметров, преобразование времени к http запросу
	var url = 'http://api-sandbox.oanda.com/v1/' +
		'candles?instrument=' + quote + '&granularity=' + granularity + '&start=' + encodeURIComponent(fromDate) +
		'&end=' + encodeURIComponent(toDate) + '&candleFormat=midpoint';
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