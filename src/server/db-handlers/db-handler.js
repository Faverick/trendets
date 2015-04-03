var rek = require('rekuire');
var TrendetsDb = rek('db');
var q = require('q');

function DbHandler(dbPath){

	var db = new TrendetsDb(dbPath);
	//var startPromise = db.exists() ? 'ok' : db.create();
	this.isHandlerReady = function(){ 
		return db.exists() ? 'ok' : db.create();
	}
	
	// this.connect = function connect(){
	// 	var asd = db.connect();
	// }

	// this.disconnect = function functionName (argument) {
	// 	db.disconnect();
	// }

	this.insertEventsToDb = function insertEventsToDb(events){
		// var promises = [];

		// db.connect().then(function (db) {
		//                 events.forEach(function(event){
		//                 	//console.log(event);
		// 					promises.push(db.Events.create(event));
		// 				})
						
		//             }).done();
		// q.all(promises).then(function () {
  //                                  console.log(promises.length + ' Events inserted into db.');
  //                            }, console.error);
		//console.log(events);
		return db.connect()
			.then(function () {				
				return db.insert(db.Events, events)
			});
		
	}

	this.insertStocksToDb = function insertStocksToDb(stocks){
		
	}

	this.extractEventsFromDb = function extractEventsFromDb(file_params){

	}

	this.extractStocksFromDb = function extractStocksFromDb(file_params){

	}
}


module.exports = DbHandler;