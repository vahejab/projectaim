angular.module('Risk').directive('ngRepeatDone', repeatDone);
   
function repeatDone($timeout){
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {  
          if ($scope.$last && $attrs.id == "risk-chart") {
            $timeout(function(){
                 $scope.$eval($attrs.ngRepeatDone);
            });
           
          }         
    }
  }
}
