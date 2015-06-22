/* jshint unused:false */
/* global require: true */

'use strict';

if(window.__karma__) {
    var allTestFiles = [];
    var TEST_REGEXP = /spec\.js$/;

    var pathToModule = function(path) {
        return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
    };

    Object.keys(window.__karma__.files).forEach(function(file) {
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            allTestFiles.push(pathToModule(file));
        }
    });
}

//var require = {
require.config({
    paths: {
        'jquery': "/bower_components/jquery/dist/jquery.min",
        'moment': 'bower_components/moment/moment',
        'bootstrap': "/bower_components/bootstrap/dist/js/bootstrap.min",        
        'd3': 'bower_components/d3/d3',
        'jstat': 'lib/jstat',        
        'moment-range': 'lib/moment-range',
        'modernizr': 'lib/modernizr',
        'angular': '/bower_components/angular/angular',
        'angularRoute': '/bower_components/angular-route/angular-route',
        'angularResource': "/bower_components/angular-resource/angular-resource",
        'angularAnimate': "/bower_components/angular-animate/angular-animate",
        'datetimepicker': "/bower_components/angular-bootstrap-datetimepicker/src/js/datetimepicker",
        'techan': "/bower_components/TechanJS/dist/techan"
    },
    shim: {
        'bootstrap': ['jquery'],
        'datetimepicker': ['angular','bootstrap', 'jquery'],
        'angular' : {'exports' : 'angular'},
        'angularRoute': ['angular'],
        'angularResource': ['angular'],
        'angularAnimate': ['angular'],
        'modernizr': {
            exports: 'Modernizr'
        }
    },
    priority: [
        "angular"
    ],
    deps: window.__karma__ ? allTestFiles : [],
    callback: window.__karma__ ? window.__karma__.start : null
});

require([
    'angular',
    'js/index'
    ], function(angular) {
        var $html = angular.element(document.getElementsByTagName('html')[0]);
        angular.element().ready(function() {
            // bootstrap the app manually
            angular.bootstrap(document, ['TrendetsApp']);
        });
    }
);