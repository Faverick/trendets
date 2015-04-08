
var app = angular.module('TrendetsApp', ['ng', 'ngRoute', 'ngResource', 'ngAnimate']);

app.controller('formCtrl', function($scope) {
    $scope.master = {firstName: "John", lastName: "Doe"};
    $scope.reset = function() {
        $scope.user = angular.copy($scope.master);
    };
    $scope.reset();
});

app.run();