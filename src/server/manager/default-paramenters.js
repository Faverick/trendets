var rek = require('rekuire');
var preparation = rek('data-preparation')

var default_parameters={
	investing:{
		language: 'ru',
		dateFrom:'2015-03-20',
		dateTo: '2015-03-25',
		country: [],
		importance: [],
		quotes_search_text: ''
	},
	stocks:{
		// fill in
	}

}

preparation.download_events(default_parameters['investing']);
preparation.download_stocks(default_parameters['stocks']);

