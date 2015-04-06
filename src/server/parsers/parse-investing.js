/* ---GETTING PARSED DATA---

Function request investing.com economic calendar and parse the responce. Parsed events then sends to the sendto_db function

---LANGUAGE---
To change language you need to chang URL in options variable

---FILTER---
Filter on investing.com looks like this:
form:{
	  	dateFrom: '2015-03-25',
	    dateTo: '2015-03-25',
	    timeZone: 18,
	    quotes_search_text: '',
	    country: [4, 5,6,7,9,10,11,12,14,15,17,20,21,22,23,24,25,26,27,29,32,33,34,35,36,37,38,39,41,42,43,
					44,45,46,48,51,52,53,54,55,56,57,59,60,61,63,68,70,71,72,75,80,84,85,87,89,90,92,93,94,96,97,100,103,
					105,106,107,109,110,111,112,113,121,122,123,125,138,143,145,162,163,170,172,178,188,193,202],
	    importance: [1,2,3]
	    category: [...]
	    timeFilter:  'timeRemain',
	    timeFrame: 'tomorrow'
	  }

If it'll be needed you can modify code below so that it contained more fields from filter.
In get all values(for fields with arrays) without filtering, just set the field to the empty array []

---RESPONSE---
Responce event looks like this:
{ id: '55378',
  time: '2015-03-27 19:30:00',
  country: 'Канада',
  currency: 'CAD',
  importance: 'bull2',
  descriptrion: 'Количество чистых спекулятивных позиций по CAD от CFTC',
  actual: '-32,7K',
  forecast: ' ',
  previous: '-32,8K' }

---TESTING---
parse_investing('ru', '2015-02-01', '2015-03-01', function(event_p){console.log(event_p)})
parse_investing('en', '2015-02-01', '2015-03-01', function(event_p){console.log(event_p['time'])})

*/

var request = require('request'),
	cheerio = require('cheerio'),
	moment = require('moment'),
	q = require('q'),
	rek = require('rekuire'),
	logger = rek('winstonlog');

function parseWithSplitting(lang, fromDate, toDate){
	logger.info('enter parseWithSplitting');
	var prevDate = moment(fromDate),
		endDate = moment(toDate),
		stepTime = {month:1},
		curDate = moment(fromDate).add(stepTime);
	var promises = [ ];

	while (curDate<endDate){
		promises.push(parseInvesting(lang, prevDate.format('YYYY-MM-DD'), curDate.format('YYYY-MM-DD')));
		prevDate.add(stepTime);
		curDate.add(stepTime);
	}
	promises.push(parseInvesting(lang, prevDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')));

	var allPromise = q.defer();
	q.all(promises).then(function(results){
		results.forEach(function (result) {
			var merged = [];
			merged = merged.concat.apply(merged, result);
			allPromise.resolve(merged);
	    });
	}, function(result, error){
		allPromise.reject();	
	})
	return allPromise.promise;
}	

function parseInvesting(lang, fromDate, toDate){ 
	var langUrl = {
		'en': 'www',
		'ru' : 'ru'
	};
	var d = q.defer();

	logger.info("entered parseInvesting");
	var options = {
		url: 'http://'+langUrl[lang]+'.investing.com/economic-calendar/filter',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36',
			'X-Requested-With': 'XMLHttpRequest'
		},
		form:{
			dateFrom: fromDate,
			dateTo: toDate,
			quotes_search_text: '',
			timeZone:55 // must be in form to get response without errors. cant be equal to 0. i dont know why. just is.	    
		},
	};

	function callback(error, response, body) {
		logger.info("entered callback");
		if (!error && response.statusCode == 200) {
			var allEvents = [];
			var json = JSON.parse(body);
			if (json['renderedFilteredEvents'] != null){
				var $ = cheerio.load(json['renderedFilteredEvents']);

				$('tr[event_attr_id]').each(function() {
					var cols = $(this).find('td')
					var econ_event = {
						eventId: $(this).attr('id').replace('eventRowId_',''),
						time: $(this).attr('event_timestamp'),
						country: $(cols['1']).find('span').attr('title'),
						currency: $(cols['1']).text().trim(),
						importance: $(cols['2']).attr('data-img_key'),
				        description: $(cols['3']).text().trim(),
				        actual: $(cols['4']).text(),
				        forecast: $(cols['5']).text(),
				        previous: $(cols['6']).text()
					}
					allEvents.push(econ_event)				
				})
			}
			d.resolve(allEvents);
		} else{
			 //console.log('Error' + response.statusCode);
			// TODO: raise exception. console.log(response.statusCod)
			d.reject();
		}
		
	}
	logger.info("about to send request");
	
	request.post(options, callback);

	return d.promise;
}

module.exports.parseInvesting = parseInvesting;
module.exports.parseWithSplitting = parseWithSplitting;