angular.module('Action', ['datatables', 'datatables.scroller', 'ngResource']);          
angular.module('Risk',   ['datatables', 'datatables.scroller', 'ngResource']);          

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'datatables', 'ngResource', 'Action', 'Risk']);

app.controller('MainController', ['DTOptionsBuilder']);

app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider){
    configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
}]);