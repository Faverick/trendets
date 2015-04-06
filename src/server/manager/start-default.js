var rek = require('rekuire');
var preparation = rek('data-preparation')

var defaultParameters={
	investing:{
		language: 'en',
		dateFrom:'2014-01-01',
		dateTo: '2015-01-01',
		country: [],
		importance: [],
		quotes_search_text: ''
	},
	stocks:{
		// fill in
	},
	//The format of filter data shown below. Keep in mind that if key country or importance are empty there will be no event reterned
	//If dateTo is not provided it is set to DateTime.Now.
	//If dateFrom is not provided it will return all events from the first event to the events of dateTo
	//If dateTo and dateFrom are not provided it will return all events from the first event to the events of today
	filter:{
		dateFrom:'2014-01-01',
		dateTo: '2015-01-01',
		country: ["Italy", "Japan"],
		importance: ["bull1"],
		descriptionText: ""
	}

}

function downloadData(){
	return preparation.downloadEvents(defaultParameters['investing'])
		.then(function () {
			return preparation.downloadStocks(defaultParameters['stocks']);
		});
}

function uploadData(){
	return preparation.getEventsByFilter(defaultParameters['filter']);
}

function removeData(){
	return preparation.removeEventsByFilter(defaultParameters['filter']);
}

module.exports.downloadData = downloadData;
module.exports.uploadData = uploadData;
module.exports.removeData = removeData;
