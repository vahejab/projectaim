angular.module('Risk').directive('ngRepeatDone', repeatDone);
   
function repeatDone($timeout){
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {  
          if ($scope.$last) {
            $timeout(function(){
                 $scope.$eval($attrs.ngRepeatDone);
            });
           
          }         
    }
  }
}
