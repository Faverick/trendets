var request = require('request');
var cheerio = require('cheerio');

function parse_investing(eventDateFrom, eventDateTo, countries=[], importances=[], sendto_db){ // may be add more parameters
	// eventDateFrom: '2015-03-25'
	// eventDateTo: '2015-03-25'
	// countries: [1,2,3,...]
	// importances: [1,2,3]
	var options = {
	  url: 'http://ru.investing.com/economic-calendar/',
	  headers: {
	    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
	  },
	  form:{
	  	dateFrom: eventDateFrom,
	    dateTo: eventDateTo,
	    //timeZone: 18,
	    quotes_search_text: '',
	    country: countries,
	    importance: importances
	    //category: []
	    //timeFilter:  'timeRemain',
	    //timeFrame: 'tomorrow'
	  }
	};

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var $ = cheerio.load(body); 
	 	$('#ecEventsTable tr[event_attr_id]').each(function() {
	 		var cols = $(this).find('td')
	 		var econ_event = {
	 			id: $(this).attr('id'),
	 			time: $(this).attr('event_timestamp'),
	 			country: $(cols['1']).attr('title'),
	 			currency: $(cols['1']).text().trim(),
	 			importance: $(cols['2']).attr('data-img_key'),
		        descriptrion: $(cols['3']).text().trim(),
		        actual: $(cols['4']).text(),
		        forecast: $(cols['5']).text(),
		        previous: $(cols['6']).text()
	 		}
	 		sendto_db(econ_event); // может заменить на yield
	      	//console.log(econ_event);
	    })
	  } else{
	    	// TODO: raise exception. console.log(response.statusCod)
	  }
	}

	request(options, callback);
}

