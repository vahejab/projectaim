angular.module('Home', []);
angular.module('Action', ['datatables', 'datatables.scroller', 'ngMaterial', 'ngResource']);          
angular.module('Risk',   ['datatables', 'datatables.scroller', 'ngResource']);          

var app = angular.module('Main', ['ui.router', 'oc.lazyLoad', 'datatables', 'ngResource', 'Home', 'Action', 'Risk']);

app.controller('MainController', ['DTOptionsBuilder']);

app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider) {
   /* $mdThemingProvider.theme('custom')
                      .primaryPalette('blue')
                      .accentPalette('blue-grey');
    $mdThemingProvider.setDefaultTheme('custom')
    $mdThemingProvider.alwaysWatchTheme(true);
    */
    configRoutes($stateProvider, $urlRouterProvider, $ocLazyLoadProvider);
    
}]);