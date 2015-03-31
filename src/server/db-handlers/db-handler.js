var rek = require('rekuire')
var TrendetsDb = rek('db')

function dbHandler(dbPath){

	var db = new TrendetsDb(dbPath)
	db.exists() ? 'ok' : db.create();
	
	this.connect = function connect(){
		db.connect()
	}

	this.disconnect = function function_name (argument) {
		db.disconnect()
	}

	this.insert_events_todb = function insert_events_todb(events){
		events.forEach(function(event){
			db.Events.create(event)
		})
	}

	this.insert_stocks_todb = function insert_stocks_todb(stocks){
		
	}

	this.extract_events_fromdb = function extract_events_fromdb(file_params){

	}

	this.extract_stocks_fromdb = function extract_stocks_fromdb(file_params){

	}
}


module.exports.dbHandler = dbHandler;