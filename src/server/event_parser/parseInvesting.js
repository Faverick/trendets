var request = require('request');
var cheerio = require('cheerio');

/* ---GETTING PARSED DATA---

Function request investing.com economic calendar and parse the responce. Parsed events then sends to the sendto_db function

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


  ---testing---
parse_investing('2015-03-20','2015-03-20', function(event_p){console.log(event_p)})
parse_investing('2015-03-25','2015-03-25', function(event_p){console.log(event_p['time'])})

*/

var fs = require('fs');

function filelog(str){
	fs.writeFile("/Work/temp.txt", str, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
}


function parse_investing(eventDateFrom, eventDateTo, sendto_db, countries, importances){ 
	countries = typeof countries !== 'undefined' ? countries : [];
	importances = typeof importances !== 'undefined' ? importances : [];

	var options = {
	  url: 'http://ru.investing.com/economic-calendar/',
	  headers: {
	    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36',
	    'Accept': 'application/json, text/javascript, */*; q=0.01',
		'Origin': 'http://www.investing.com',
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Referer': "http://www.investing.com/economic-calendar/",
		'Accept-Encoding': 'deflate',
		'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4'
	  },
	  form:{
	  	dateFrom: eventDateFrom,
	    dateTo: eventDateTo,
	    quotes_search_text: '',
	    //country: countries,
	    //importance: importances,
	    timeZone:8,
	    timeFilter:  'timeRemain'
	    //timeFrame: 'tomorrow',	    
	  }
	};

	console.log(eventDateFrom)
	console.log(eventDateTo)

	function callback(error, response, body) {
	  if (!error && response.statusCode == 200) {

	    var $ = cheerio.load(body); 

	    filelog(body)

	 	$('#ecEventsTable tr[event_attr_id]').each(function() {
	 		var cols = $(this).find('td')
	 		var econ_event = {
	 			id: $(this).attr('id').replace('eventRowId_',''),
	 			time: $(this).attr('event_timestamp'),
	 			country: $(cols['1']).find('span').attr('title'),
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
	  		console.log(response.statusCode);
	    	// TODO: raise exception. console.log(response.statusCod)
	  }
	}
	request.post(options, callback);
}
