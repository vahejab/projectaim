angular.module('Risk').controller('RiskMatrixConfigController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
    $scope.risk = function(l, c){
        return "low";
    }
}]);
