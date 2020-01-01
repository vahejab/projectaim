angular.module('Risk').directive('ngRepeatDone', repeatDone);
function repeatDone(){
  return {
    restrict: 'A',
    controller: function($scope, $element, $attrs) {
          if ($scope.$last) {
            $scope.$eval($attrs.ngRepeatDone);
          }
    }
  }
}
