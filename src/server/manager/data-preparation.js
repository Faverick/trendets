var investing = require('parse-investing')


function download_events(events_params){


	function sendto_db(events){
		// call db function
	}

	investing.parse_investing(events_params['language'], events_params['dateFrom'], events_params['dateTo'], sendto_db);
}

function download_stocks(stocks_params){


	function sendto_db(stocks){
		// call db function
	}

	// call stock parser with callback func
}

function events_to_files(file_params){
	// вызвать загрузку данных из бд в файлы
}

function stocks_to_files(file_params){
	// вызвать загрузку данных из бд в файлы
}