var rek = require('rekuire')
var TrendetsDb = rek('db')

function DbHandler(dbPath){

	var db = new TrendetsDb(dbPath)
	db.exists() ? 'ok' : db.create();
	
	// this.connect = function connect(){
	// 	var asd = db.connect();
	// }

	// this.disconnect = function functionName (argument) {
	// 	db.disconnect();
	// }

	this.insertEventsToDb = function insertEventsToDb(events){
		db.connect()
            .then(function (db) {
                events.forEach(function(event){
                	console.log(event);
					db.Events.create(event);
				})
				db.disconnect(db);
            })
		
	}

	this.insertStocksToDb = function insertStocksToDb(stocks){
		
	}

	this.extractEventsFromDb = function extractEventsFromDb(file_params){

	}

	this.extractStocksFromDb = function extractStocksFromDb(file_params){

	}
}


module.exports = DbHandler;