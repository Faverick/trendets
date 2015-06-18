angular.module('TrendetsApp.Interaction', [])
  .factory('dataResources', ['$http',  function($http) {
    var events = {};
    var stocks = {};

    var submit = function(form, urlToRequest){
      $http.post('/api/events', form).
        success(function(data) {
          events = data;
        });

      $http.post('/api/stocks', urlToRequest).
        success(function(data) {
          stocks = data;
        });
    };

    return {
      events: events,
      stocks: stocks,
      submit: submit
    };
}]);