var rek = require('rekuire');
var TrendetsDb = rek('db');
var q = require('q');
var logger = rek('winstonlog');

function DbHandler(dbPath){

	var db = new TrendetsDb(dbPath);

	this.isHandlerReady = function(){ 
		logger.info('entered db-handler/DbHandler.isHandlerReady');
		return db.exists() ? 'ok' : db.create();
	}

	this.insertEventsToDb = function insertEventsToDb(events){

		return db.connect()
			.then(function () {				
				return db.insert(db.Events, events);
			});
		
	}

	this.insertStocksToDb = function insertStocksToDb(stocks){
		
	}

	this.extractEventsFromDb = function extractEventsFromDb(file_params){

	}

	this.extractStocksFromDb = function extractStocksFromDb(file_params){

	}

	this.getEventsByFilter = function getEventsByFilter(filerParams){

		return db.connect()
			.then(function () {
				return db.get(db.Events, filerParams);
			}).catch(function (err){
				console.error(err);
			});
	}

	this.removeEvents = function removeEvents(events){
		return db.connect()
			.then(function(){
				return db.remove(db.Events, events);
				}).catch(function (err){
				console.error(err);
			});
	}
}


module.exports = DbHandler;