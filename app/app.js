angular.module('Action', ['datatables', 'datatables.scroller', 'ngResource']);          

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'datatables', 'ngResource', 'Action']);

app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider){
            configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
}]);
                        

