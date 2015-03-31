var rek = require('rekuire')
var TrendetsDb = rek('db')

function DbHandler(dbPath){

	var db = new TrendetsDb(dbPath)
	db.exists() ? 'ok' : db.create();
	
	this.connect = function connect(){
		db.connect()
	}

	this.disconnect = function functionName (argument) {
		db.disconnect()
	}

	this.insertEventsToDb = function insertEventsToDb(events){
		events.forEach(function(event){
			db.Events.create(event)
		})
	}

	this.insertStocksToDb = function insertStocksToDb(stocks){
		
	}

	this.extractEventsFromDb = function extractEventsFromDb(file_params){

	}

	this.extractStocksFromDb = function extractStocksFromDb(file_params){

	}
}


module.exports.DbHandler = DbHandler;