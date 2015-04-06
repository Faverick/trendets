var fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var orm = require("orm");
var q = require('q');

var defaultDbPath = path.join(__dirname, 'trendets.db');

function TrendetsDb(dbPath) {

    dbPath = dbPath || defaultDbPath;

    var self = this,
        connection = null;

    this.connect = function () {
        var d = q.defer();
        connect().then(defineModels)
                 .then(function (db) {
                    Object.keys(db.models).forEach(function (modelName) {
                        self[modelName] = db.models[modelName];
                        promisifyModel(self[modelName]); // TODO: create a promise-shell for db.model || db
                    })
                         
                     d.resolve(self);
                 }, d.reject);
        return d.promise;
    }

    this.exists = function exists() {
        return fs.existsSync(dbPath);
    }

    this.create = function create() {
        if (this.exists())
            throw new Error('Database at ' + dbPath + ' already exists.');

        var res = connect().then(createTables)
                           .then(defineModels)
                           .then(this.disconnect).then(function(){console.log('creating finished')});

        console.info('Database at ' + dbPath + ' created.');

        return res;
    }

    this.insert =  function insert(model, obj) {
        if (obj instanceof Array) {
            var promises = [];
            for (var i = 0; i < obj.length; i++) {
                promises.push(insert(model, obj[i]));
            }
            return q.all(promises);
        } else {
            var d = q.defer();
            model.create([obj], resolveDeferred(d));
            return d.promise;
        }
    }

    this.get = function get(model, filterParam) {
        // var promises = [];
        // Object.keys(filterParam).forEach(function (key) {
        //     console.log(key,'is ',filterParam[key]);
        // });
        
        //description: orm.like("%"+filterParam['descriptionText']+"%")
        //country: filterParam['country']
        //importance: filterParam['importance']

        if(filterParam['importance'].length <= 0 || filterParam['country'].length <= 0)
        {
            throw new Error("Provided bad parameters for importance or country");
        }

        var date = new Date();
        if(filterParam['dateTo'] !== ''){
            date = new Date(filterParam['dateTo']);
            date.setDate(date.getDate() + 1);
        }

        var d = q.defer();
        model.find({time: orm.gte(filterParam['dateFrom']) && orm.lte(date.toISOString())
                , country: filterParam['country'], importance: filterParam['importance']
                , description: orm.like("%"+filterParam['descriptionText']+"%")}, (function (error, events){
            if (error) {
                console.error(error);
                d.reject(errror);
            } else
            {
                d.resolve(events);
            }   
        }));
        
        return d.promise;
    }

    this.remove = function remove(model, obj) {
        if (obj instanceof Array) {
            var promises = [];
            for (var i = 0; i < obj.length; i++) {
                promises.push(remove(model, obj[i]));
            }
            return q.all(promises);
        } else {
            var d = q.defer();
            obj.remove(function (err){
                if(err) {
                    console.error(err);
                    d.reject(err);
                }
                else {
                    console.log(obj, "removed");
                    d.resolve();
                }
            });
            return d.promise;
        }
    }

    
    this.delete = function deleteDb() {
        if (this.exists()) {
            fs.unlinkSync(dbPath);
            console.info('Database at ' + dbPath + ' deleted.');
        } else
            console.info('Database at ' + dbPath + ' not found - nothing to delete.');
    }


    this.disconnect = function disconnect(db) {
        console.log('Disconnecting')
        var d = q.defer();
        db.close(resolveDeferred(d));
        return d.promise.then(function () {
            connection = null;
        });
    }

    function connect() {
        var d = q.defer();
        if (connection !== null) {
            d.resolve(connection);
            return d.promise;
        }
        orm.connect('sqlite://' + dbPath, resolveDeferred(d));
        return d.promise.then(function (db) {
            connection = db;
            return db;
        });
    }


    function createTables(db) {
        console.log('creating Tables');
        return runSqlFile(db, path.join(__dirname, 'tables.sql'));
    }

    function runSqlFile(db, filePath) {
        console.log(filePath);
        var sql = fs.readFileSync(filePath, { encoding: 'utf8' }),
            d = q.defer();
        db.driver.db.exec(sql, resolveDeferred(d, db));
        return d.promise;
    }


    function defineModels(db) {

        var d = q.defer();

        console.log('ORM models start initializing.');
        var Events = db.define('Events', getColumnMapping({
            eventId: { type: 'number', mapsTo: 'EventId' },
            time: { type: 'date', mapsTo: 'DateTime' },
            country : { type: 'text', mapsTo: 'Country' },
            currency : { type: 'text', mapsTo: 'Currency' },
            importance : { type: 'text', mapsTo: 'Importance' },
            description : { type: 'text', mapsTo: 'Description' },
            actual: { type: 'text', mapsTo: 'Actual' },
            forecast: { type: 'text', mapsTo: 'Forecast' },
            previous: { type: 'text', mapsTo: 'Previous' },
        }));
        

        console.log('ORM models initialized.');
        d.resolve(db);

        return d.promise;
    }

    function getColumnMapping(additionalColumnMapping) {
        var commonMap = {
            id: { type: 'serial', key: true, mapsTo: 'Id' }
        };
        for (var f in additionalColumnMapping) {
            commonMap[f] = additionalColumnMapping[f];
            if (!commonMap[f].mapsTo)
                commonMap[f].mapsTo = f.substring(0, 1).toUpperCase() + f.substring(1, f.length);
        }
        return commonMap;
    }


    function one(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'one', args);
    }

    function find(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'find', args);
    }

    function all(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'all', args);
    }

    function get(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'get', args);
    }

    function count(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'count', args);
    }

    function exists(model/*, arg1, arg2, ..., argN */) {
        var args = Array.prototype.slice.call(arguments, 1);
        return deferFunc(model, 'exists', args);
    }

    //  wraps obj[funcName] function into promise and calls.
    function deferFunc(obj, funcName, argsArray) {
        var d = q.defer();
        argsArray.push(resolveDeferred(d));
        obj[funcName].apply(obj, argsArray);
        return d.promise;
    }

    function promisifyModel(model) {
        promisifyFunc(model, 'one');
        //promisifyFunc(model, 'get');
        //promisifyFunc(model, 'all');
        promisifyFunc(model, 'create');
    }

    function promisifyFunc(obj, funcName) {
        var original = {},
            originalFunc = obj[funcName];
        original[funcName] = obj[funcName];
        obj[funcName] = function () {
            var args = Array.prototype.slice.call(arguments),
                d = q.defer();
            args.push(resolveDeferred(d));
            originalFunc.apply(obj, args);
            return d.promise;
            //return deferFunc(original, funcName, args);
        }
    }
}

function resolveDeferred(deferred, resolveValue) {
    return function (err, res) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        } else
            deferred.resolve(resolveValue || res);
    }
}


module.exports = TrendetsDb;