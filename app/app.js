angular.module('Home', []);
angular.module('Action', ['datatables', 'datatables.scroller', 'ngMaterial', 'ngResource']);          
angular.module('Risk',   ['datatables', 'datatables.scroller', 'ngResource']);          

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'datatables', 'ngResource', 'Home', 'Action', 'Risk']);

app.controller('MainController', ['DTOptionsBuilder']);

app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider){
    configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
}]);