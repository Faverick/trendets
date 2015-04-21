
var request = require('request'),
    moment = require('moment'),
    q = require('q');

function parseCurrencyJson(responseBody){
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

function parseCurrencyQuotes(quote, momentFrom, momentTo, granularity){

    var url = 'http://api-sandbox.oanda.com/v1/' +
        'candles?instrument=' + quote + '&granularity=' + granularity + '&start=' +
        encodeURIComponent(momentFrom.format("YYYY-MM-DDTHH:mm:ssZ")) +
        '&end=' + encodeURIComponent(momentTo.format("YYYY-MM-DDTHH:mm:ssZ")) + '&candleFormat=midpoint';
    request(url, function(error, response, body){
        if (error) {
            console.error(error);
            throw error;
        } else if (response.statusCode == 200) {
            var quotes = parseCurrencyJson(body);
        }
    })


}

