var rek = require('rekuire');
var preparation = rek('data-preparation')

var defaultParameters={
	investing:{
		language: 'ru',
		dateFrom:'2015-03-25',
		dateTo: '2015-03-25',
		country: [],
		importance: [],
		quotes_search_text: ''
	},
	stocks:{
		// fill in
	}

}

function downloadData(){
	return preparation.downloadEvents(defaultParameters['investing'])
		.then(function () {
			return preparation.downloadStocks(defaultParameters['stocks']);
		});
}

module.exports.downloadData = downloadData;
