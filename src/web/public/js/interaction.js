angular.module('TrendetsApp.Interaction', [])
  .factory('data', ['$http', '$location',  function($http) {
    var events = {};
    var stocks = {};

    var submit = function(form){
      $http.post('/api/post', $scope.form).
        success(function(data) {
          events = data;
        });
    };

    return {
      events: events,
      stocks: stocks,
      submit: submit
    };
}
    }
  }])