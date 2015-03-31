var rek = require('rekuire');
var investing = rek('parse-investing'),
	stocks = rek('parse-stocks'),
	DbHandler = rek('db-handler');


function downloadEvents(eventsParams){
	console.log('Downloading Events');
	var TrendetsHandler = new DbHandler();

	//TrendetsHandler.connect()
	function sendToDb(events){
		// call db function
		console.log("enetered sendToDb");
		TrendetsHandler.insertEventsToDb(events);
	}
	// добавить разбиение запроса в investing'e по неделям для русского языка
	investing.parseInvesting(eventsParams['language'], eventsParams['dateFrom'], eventsParams['dateTo'], sendToDb);
	console.log("left downloadEvents")
	//TrendetsHandler.disconnect()
}

function downloadStocks(stocksParams){

	function sendToDb(stocks){
		// call db function
		TrendetsHandler.insertStocksToDb(stocks);
	}

	// call stock parser with callback func
	stocks.parseStocks(stocksParams['fromDate'], stocksParams['toDate'], sendToDb);
}

function eventsToFiles(fileParams){
	// вызвать загрузку данных из бд в файлы
	// db_handler.extract_events_fromdb(file_params);
}

function stocksToFiles(fileParams){
	// вызвать загрузку данных из бд в файлы
	// db_handler.extract_stocks_fromdb(file_params);
}

module.exports.downloadEvents = downloadEvents;
module.exports.downloadStocks = downloadStocks;