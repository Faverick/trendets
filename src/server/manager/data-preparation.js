var rek = require('rekuire');
var investing = rek('parse-investing'),
	stocks = rek('parse-stocks'),
	dbHandler = rek('db-handler');


function download_events(events_params){
	console.log('Downloading Events');
	dbHandler.connect()
	function sendto_db(events){
		// call db function
		dbHandler.insert_events_todb(events);
	}
	// добавить разбиение запроса в investing'e по неделям для русского языка
	investing.parse_investing(events_params['language'], events_params['dateFrom'], events_params['dateTo'], sendto_db);
	dbHandler.disconnect()
}

function download_stocks(stocks_params){

	function sendto_db(stocks){
		// call db function
		dbHandler.insert_stocks_todb(stocks);
	}

	// call stock parser with callback func
	stocks.parse_stocks(stocks_params['fromDate'], stocks_params['toDate'], sendto_db);
}

function events_to_files(file_params){
	// вызвать загрузку данных из бд в файлы
	// db_handler.extract_events_fromdb(file_params);
}

function stocks_to_files(file_params){
	// вызвать загрузку данных из бд в файлы
	// db_handler.extract_stocks_fromdb(file_params);
}

module.exports.download_events = download_events;
module.exports.download_stocks = download_stocks;