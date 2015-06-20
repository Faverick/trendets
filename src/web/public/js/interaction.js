define(['angular'
], function(angular){
  angular.module('TrendetsApp.Interaction', [])
    .factory('dataResources', ['$http',  function($http) {
      var events = {};
      var stocks = {};


      var submit = function(form, urlToRequest, callback){
        var eventsReceived = false;
        var stocksReceived = false;

        $http.post('/api/events', form).
          success(function(data) {
            events = data;
            onDataReceived('events');
          });

        $http.post('/api/stocks', urlToRequest).
          success(function(data) {
            stocks = data;
            onDataReceived('stocks');
          });

        var onDataReceived = function(type){
          if (type==='events') {
            eventsReceived = true;
          };
          if (type==='stocks') {
            stocksReceived = true;
          };
          if (eventsReceived && stocksReceived) {
            callback({
              events: events,
              stocks: stocks});
          };
        }
      };

      

      return {
        events: events,
        stocks: stocks,
        submit: submit
      };
  }]);
})

