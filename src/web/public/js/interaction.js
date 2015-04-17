angular.module('TrendetsApp.Interaction', [])
  .factory('dataResources', ['$http',  function($http) {
    var events = {};
    var stocks = {};

    var submit = function(form){
      $http.post('/api/events', form).
        success(function(data) {
          events = data;
        });
    };

    return {
      events: events,
      stocks: stocks,
      submit: submit
    };
}]);