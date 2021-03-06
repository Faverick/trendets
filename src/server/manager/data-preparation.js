var rek = require('rekuire'),
	q = require('q');


var logger = rek('winstonlog'),
	investing = rek('parse-investing'),
	stocks = rek('parse-stocks'),
	DbHandler = rek('db-handler');

function downloadEvents(eventsParams){
	logger.info('Downloading Events');
	var TrendetsHandler = new DbHandler();

	function sendToDb(events){
		logger.info("enetered insertToDb");
		return TrendetsHandler.insertEventsToDb(events)
			.then(function  (argument) {
				logger.info("left insertToDb");
			});
		
	}
	// добавить разбиение запроса в investing'e по неделям для русского языка
	var promise = q.when(TrendetsHandler.isHandlerReady())
	 	.then(function () {
	 		investing.parseWithSplitting(eventsParams['language'], eventsParams['dateFrom'], eventsParams['dateTo'])
	 			.then(function (events){
	 				sendToDb(events);
	 			});
	 	});
	logger.info("left downloadEvents")

	return promise;
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

function getEventsByFilter(filterParams){
	var TrendetsHandler = new DbHandler();

	console.log("enetered getEvenetsByFilter");
		return TrendetsHandler.getEventsByFilter(filterParams)
					.then(function (events) {
				console.log("left getEvenetsByFilter");
				return events;
			});
}


function removeEventsByFilter(filterParams){
	var TrendetsHandler = new DbHandler();

	return TrendetsHandler.getEventsByFilter(filterParams)
			.then(function (events){
				console.log("enetered removeEvenetsByFilter");
				return TrendetsHandler.removeEvents(events)
					.then(function (){
						console.log("left removeEvenetsByFilter");
					})
			});

}

module.exports.downloadEvents = downloadEvents;
module.exports.downloadStocks = downloadStocks;
module.exports.getEventsByFilter = getEventsByFilter;
module.exports.removeEventsByFilter = removeEventsByFilter;