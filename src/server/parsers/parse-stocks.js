
var request = require('request'),
	cheerio = require('cheerio'),
	moment = require('moment'),
	q = require('q'),
	rek = require('rekuire'),
	logger = rek('winstonlog');


function parseStocks(fromDate, toDate, sendToFunc){
	var allStocks = [];
	var options = {
		url: 'http://195.128.78.52/EURUSD_011001_011201.csv?market=5&code=EURUSD&df=1&mf=9&yf=2001&from=01.10.2001&dt=1&mt=11&yt=2001&to=01.12.2001&p=2&f=EURUSD_011001_011201&e=.csv&cn=EURUSD&dtf=1&tmf=1&MSOR=1&mstimever=0&sep=3&sep2=1&datf=2&at=1'
	};

	function callback(error, response, body) {
		logger.info("entered callback");
		if (!error && response.statusCode == 200) {
			var allEvents = [];
			var json = JSON.parse(body);
			console.log(123123);
			console.log(json);
			// if (json['renderedFilteredEvents'] != null){
			// 	var $ = cheerio.load(json['renderedFilteredEvents']);

			// 	$('tr[event_attr_id]').each(function() {
			// 		var cols = $(this).find('td')
			// 		var econ_event = {
			// 			eventId: $(this).attr('id').replace('eventRowId_',''),
			// 			time: $(this).attr('event_timestamp'),
			// 			country: $(cols['1']).find('span').attr('title'),
			// 			currency: $(cols['1']).text().trim(),
			// 			importance: $(cols['2']).attr('data-img_key'),
			// 	        description: $(cols['3']).text().trim(),
			// 	        actual: $(cols['4']).text(),
			// 	        forecast: $(cols['5']).text(),
			// 	        previous: $(cols['6']).text()
			// 		}
			// 		allEvents.push(econ_event);			
			// 	})
			// }
			// d.resolve(allEvents);
		} else{
			 //console.log('Error' + response.statusCode);
			// TODO: raise exception. console.log(response.statusCod)
			// d.reject();
			logger.error(error);
			console.log(error);
		}
		
	}

	logger.info("about to send request");
	request.get(options, callback);

	return allStocks;
}

module.exports.parseStocks = parseStocks;