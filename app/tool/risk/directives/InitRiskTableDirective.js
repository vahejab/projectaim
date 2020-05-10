angular.module(Risk).directive('initRiskTable', initRiskTable);

function initRiskTable(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/risk/RiskTable.html',
        controller: function($scope, $timeout) {
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                
            });
        }
    }
}