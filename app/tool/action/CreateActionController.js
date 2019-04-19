angular.module('Action').config([
  '$stateProvider', 
  '$urlRouterProvider', 
  '$mdThemingProvider',
  function($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .dark();
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$state', '$timeout', function($scope){

}]);
